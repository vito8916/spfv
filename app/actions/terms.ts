'use server'

import { createClient } from '@/utils/supabase/server'

export type TermsType = 'terms_of_service' | 'privacy_policy' | 'cookie_policy' | 'acceptable_use_policy'

export async function getActiveTerms(type?: TermsType | 'all') {
  const supabase = await createClient()
  
  const query = supabase
    .from('terms_conditions')
    .select('*')
    .eq('is_active', true)
    .order('effective_date', { ascending: false })

  if (type && type !== 'all') {
    query.eq('type', type)
  }

  const { data, error } = await query

  if (error) throw error
  return type === 'all' ? data : data?.[0]
}

export async function getUserTermsAcceptance(termsId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_terms_acceptances')
    .select('*')
    .eq('user_id', user.id)
    .eq('terms_id', termsId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
  return data
}

export async function acceptTerms(termsId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if already accepted
  const existing = await getUserTermsAcceptance(termsId)
  if (existing) {
    return true // Already accepted
  }

  const { error } = await supabase
    .from('user_terms_acceptances')
    .insert({
      user_id: user.id,
      terms_id: termsId,
      ip_address: '127.0.0.1',
      user_agent: 'Unknown'
    })

  if (error) throw error
  return true
}

export async function getAllUserTermsAcceptances() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_terms_acceptances')
    .select(`
      *,
      terms:terms_conditions(*)
    `)
    .eq('user_id', user.id)

  if (error) throw error
  return data
} 