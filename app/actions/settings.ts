"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to update your profile" };
    }
    
    // Parse and validate the form data
    const name = formData.get("name") as string;
    
    // Validate with Zod
    const validatedFields = z.object({
      name: z.string().min(2).max(30),
    }).safeParse({ name });
    
    if (!validatedFields.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }
    
    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
        data: {
        full_name: name,
      },
    });
    
    if (updateError) {
      return { error: updateError.message };
    }
    
    // Revalidate the path to update the UI
    revalidatePath("/settings");
    
    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile. Please try again later." };
  }
}

export async function updatePasswordAction(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to update your password" };
    }
    
    // Parse and validate the form data
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    // Validate with Zod
    const validatedFields = z.object({
      currentPassword: z.string().min(8),
      newPassword: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .safeParse({ currentPassword, newPassword, confirmPassword });
    
    if (!validatedFields.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }
    
    // First, verify the current password by signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email || "",
      password: currentPassword,
    });
    
    if (signInError) {
      return { error: "Current password is incorrect" };
    }
    
    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (updateError) {
      return { error: updateError.message };
    }
    
    // Revalidate the path to update the UI
    revalidatePath("/settings");
    
    return { success: "Password updated successfully" };
  } catch (error) {
    console.error("Password update error:", error);
    return { error: "Failed to update password. Please try again later." };
  }
}

export async function getUserDataAction() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to view your profile" };
    }

    return {
      success: true,
      data: {
        name: user.user_metadata.full_name || "Not set",
        email: user.email || "Not set",
        avatar_url: user.user_metadata.avatar_url || "Not set",
        bio: user.user_metadata.bio || "",
        created_at: new Date(user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data" };
  }
}

export async function deleteAccountAction() {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be logged in to delete your account" };
    }
    
    // Delete user data from the users table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (deleteError) {
      console.error("Error deleting user data:", deleteError);
      return { error: "Failed to delete user data" };
    }

    // Delete the user's auth account
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      console.error("Error deleting auth user:", authError);
      return { error: "Failed to delete account" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Failed to delete account" };
  }
} 