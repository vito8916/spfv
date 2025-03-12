'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUser, type User } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
// Form schema
const formSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface UserProfileFormProps {
  initialData: User;
}

export function UserProfileForm({ initialData }: UserProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: initialData.full_name ?? '',
      avatar_url: initialData.avatar_url ?? '',
      bio: initialData.bio ?? '',
    },
  });

  // Handle form submission
  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        const result = await updateUser({
          full_name: data.full_name,
          avatar_url: data.avatar_url || undefined,
          bio: data.bio || undefined,
        });

        if (!result.success) {
          toast.error(result.error || 'Failed to update profile');
          return;
        }

        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('An unexpected error occurred');
        console.error('Error updating profile:', error);
      } finally {
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
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
                <Input 
                  placeholder="Tell us a little bit about yourself" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                {field.value?.length || 0}/160 characters
              </p>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
} 