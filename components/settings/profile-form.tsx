"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/settings";
import { useEffect, useState } from "react";
import { updateProfileAction } from "@/app/actions/settings";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileForm() {
  const [userData, setUserData] = useState<ProfileFormValues | null>(null);
  const router = useRouter(); 
  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserData({
            name: user.user_metadata.full_name || "",
            email: user.email || "",
            bio: user.user_metadata.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    }
    
    fetchUserData();
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userData || {
      name: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  });

  // Update form values when userData changes
  useEffect(() => {
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio || "");
      
      // Call the server action
      const result = await updateProfileAction(formData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      if (result.success) {
        toast.success(result.success);
        
        // Update local state
        setUserData({
          name: data.name,
          email: data.email,
          bio: data.bio || "",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      router.refresh();
    }
  }
  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} readOnly disabled />
              </FormControl>
              <FormDescription>
                Your email address is used for notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  );
} 