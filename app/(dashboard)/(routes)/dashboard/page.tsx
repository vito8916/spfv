import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/app/actions/auth";
import { getActiveSubscription } from "@/app/actions/subscriptions";
import { Suspense } from "react";
import { BarChart3, Users, CreditCard } from "lucide-react";
import { formatDate } from "@/utils/utils";

// Add revalidation to ensure fresh data
export const revalidate = 0;

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="h-40 rounded-xl bg-card/50 animate-pulse" />
        <div className="h-40 rounded-xl bg-card/50 animate-pulse" />
        <div className="h-40 rounded-xl bg-card/50 animate-pulse" />
      </div>
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 animate-pulse md:min-h-min" />
    </div>
  );
}

async function DashboardContent() {
  // Get user data using the established pattern in your app
  const user = await getAuthUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  // Get subscription data
  const { subscription } = await getActiveSubscription(user.id);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.user_metadata.full_name || 'User'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </div>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.metadata?.plan || 'No Plan'}
            </div>
            {subscription ? (
              <p className="text-xs text-muted-foreground">
                Renews {formatDate(subscription.current_period_end)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No active subscription
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Usage statistics coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
          <CardDescription>
            Your account details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.user_metadata.full_name || 'Not set'}</p>
            </div>
            {user.user_metadata.bio && (
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium">Bio</p>
                <p className="text-sm text-muted-foreground">{user.user_metadata.bio}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Section - Placeholder for future content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent activity and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const DashboardPage = async () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
