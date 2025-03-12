'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from 'react';
import { z } from "zod";

// Types
export type SubscriptionMetadata = {
  notes?: string;
  customerId?: string;
  [key: string]: string | undefined;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  metadata: SubscriptionMetadata | null;
};

// Validation schemas
const createSubscriptionSchema = z.object({
  id: z.string().min(1, 'Subscription ID is required'),
  user_id: z.string().min(1, 'User ID is required'),
  price_id: z.string().min(1, 'Price ID is required'),
  status: z.enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid']),
  quantity: z.number().min(1),
  cancel_at_period_end: z.boolean(),
  current_period_start: z.string(),
  current_period_end: z.string(),
  metadata: z.record(z.string()).optional(),
});

const updateSubscriptionSchema = z.object({
  id: z.string().min(1, 'Subscription ID is required'),
  status: z.enum(['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid']).optional(),
  cancel_at_period_end: z.boolean().optional(),
  quantity: z.number().min(1).optional(),
  metadata: z.record(z.string()).optional(),
});

/**
 * Create a new subscription
 */
export async function createSubscription(
  data: z.infer<typeof createSubscriptionSchema>
): Promise<{ success: boolean; error?: string; subscription?: Subscription }> {
  try {
    const validatedData = createSubscriptionSchema.parse(data);
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: error.message };
    }

    // Revalidate all subscription-related paths
    revalidatePath('/dashboard');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true, subscription };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error creating subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a subscription by ID with caching
 */
export const getSubscriptionById = cache(async (id: string): Promise<{ success: boolean; error?: string; subscription?: Subscription }> => {
  try {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
});

/**
 * Get subscriptions by user ID with caching
 */
export const getSubscriptionsByUserId = cache(async (userId: string): Promise<{ success: boolean; error?: string; subscriptions?: Subscription[] }> => {
  try {
    const supabase = await createClient();

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscriptions };
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
});

/**
 * Update a subscription
 */
export async function updateSubscription(
  data: z.infer<typeof updateSubscriptionSchema>
): Promise<{ success: boolean; error?: string; subscription?: Subscription }> {
  try {
    const validatedData = updateSubscriptionSchema.parse(data);
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update(validatedData)
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }

    // Revalidate all subscription-related paths
    revalidatePath('/dashboard');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true, subscription };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    console.error('Error updating subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const updateData = {
      status: cancelImmediately ? 'canceled' : 'active',
      cancel_at_period_end: !cancelImmediately,
      canceled_at: new Date().toISOString(),
      ...(cancelImmediately && { ended_at: new Date().toISOString() }),
    };

    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }

    // Revalidate all subscription-related paths
    revalidatePath('/dashboard');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a subscription (Admin only)
 */
export async function deleteSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subscriptionId);

    if (error) {
      console.error('Error deleting subscription:', error);
      return { success: false, error: error.message };
    }

    // Revalidate all subscription-related paths
    revalidatePath('/dashboard');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get active subscription for a user with caching
 */
export const getActiveSubscription = cache(async (userId: string): Promise<{ success: boolean; error?: string; subscription?: Subscription }> => {
  try {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error fetching active subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
});
