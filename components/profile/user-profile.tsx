import { getCurrentUser } from '@/app/actions/users';
import { UserProfileForm } from './user-profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export async function UserProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Please sign in to view your profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback>{user.full_name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.full_name ?? 'User'}</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserProfileForm initialData={user} />
        </CardContent>
      </Card>

      {/* Billing Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Manage your billing information</CardDescription>
        </CardHeader>
        <CardContent>
          {user.billing_address ? (
            <div className="space-y-1 text-sm">
              <p>{user.billing_address.street}</p>
              <p>
                {user.billing_address.city}, {user.billing_address.state}{' '}
                {user.billing_address.postalCode}
              </p>
              <p>{user.billing_address.country}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No billing address set</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          {user.payment_method ? (
            <div className="flex items-center gap-4">
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {user.payment_method.brand.toUpperCase()} •••• {user.payment_method.last4}
                </p>
                <p className="text-muted-foreground">
                  Expires {user.payment_method.expMonth}/{user.payment_method.expYear}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment method saved</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 