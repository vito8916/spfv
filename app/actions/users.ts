'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';
import { revalidatePath } from 'next/cache';

// Types
export type BillingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentMethod = {
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
};

export type User = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  billing_address: BillingAddress | null;
  payment_method: PaymentMethod | null;
  phone: string | null;
};

// Validation schemas
const billingAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

const paymentMethodSchema = z.object({
  type: z.string(),
  last4: z.string().length(4),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(new Date().getFullYear()),
  brand: z.string(),
});

const updateUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').optional(),
  avatar_url: z.string().url('Invalid URL').optional(),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  billing_address: billingAddressSchema.optional(),
  payment_method: paymentMethodSchema.optional(),
  phone: z.string().optional(),
});

/**
 * Get the current user's profile with caching
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
});

/**
 * Get a user by ID with caching
 */
export const getUserById = cache(async (id: string): Promise<User | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
});

/**
 * Update user profile and revalidate cache
 */
export async function updateUser(
  updates: z.infer<typeof updateUserSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = updateUserSchema.parse(updates);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Start parallel updates
    const [userTableUpdate, authUpdate] = await Promise.all([
      // Update users table
      supabase
        .from('users')
        .update(validatedData)
        .eq('id', user.id),
      
      // Update auth metadata if full_name or bio is being updated
      (validatedData.full_name || validatedData.bio)
        ? supabase.auth.updateUser({
            data: { 
              ...(validatedData.full_name && { full_name: validatedData.full_name }),
              ...(validatedData.bio && { bio: validatedData.bio })
            }
          })
        : Promise.resolve(null)
    ]);

    if (userTableUpdate.error) {
      console.error('Error updating user table:', userTableUpdate.error);
      return { success: false, error: userTableUpdate.error.message };
    }

    if (authUpdate?.error) {
      console.error('Error updating auth metadata:', authUpdate.error);
      return { success: false, error: authUpdate.error.message };
    }

    revalidatePath('/profile');
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    console.error('Error updating user:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete user account and clear cache
 */
export async function deleteUser(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Start a transaction to delete user data
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', user.id);

  if (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }

  // Sign out the user after deletion
  await supabase.auth.signOut();

  // Revalidate relevant paths
  revalidatePath('/');
  return { success: true };
}

/**
 * Update billing address and revalidate cache
 */
export async function updateBillingAddress(
  address: z.infer<typeof billingAddressSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validatedAddress = billingAddressSchema.parse(address);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('users')
      .update({ billing_address: validatedAddress })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating billing address:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the cache for billing-related pages
    revalidatePath('/profile');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    console.error('Error updating billing address:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update payment method and revalidate cache
 */
export async function updatePaymentMethod(
  paymentMethod: z.infer<typeof paymentMethodSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validatedPaymentMethod = paymentMethodSchema.parse(paymentMethod);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('users')
      .update({ payment_method: validatedPaymentMethod })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating payment method:', error);
      return { success: false, error: error.message };
    }

    // Revalidate the cache for payment-related pages
    revalidatePath('/profile');
    revalidatePath('/settings');
    revalidatePath('/billing');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    console.error('Error updating payment method:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
