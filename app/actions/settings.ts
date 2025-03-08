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
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string;
    
    // Validate with Zod
    const validatedFields = z.object({
      name: z.string().min(2).max(30),
      email: z.string().email(),
      bio: z.string().max(160).optional(),
    }).safeParse({ name, email, bio });
    
    if (!validatedFields.success) {
      return { error: "Invalid form data. Please check your inputs." };
    }
    
    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      email: email !== user.email ? email : undefined,
      data: {
        full_name: name,
        bio: bio || null,
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