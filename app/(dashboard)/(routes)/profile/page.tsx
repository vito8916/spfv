import { Suspense } from 'react';
import { UserProfile } from '@/components/profile/user-profile';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 0; // Make sure the page is always fresh

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        }
      >
        <UserProfile />
      </Suspense>
    </div>
  );
} 