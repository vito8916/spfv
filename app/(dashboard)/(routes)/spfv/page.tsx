import { Suspense } from "react";
import { getAuthUser } from "@/app/actions/auth";
import { getActiveSubscription } from "@/app/actions/subscriptions";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lock,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import SpfvIconTool from "@/components/shared/spfv-icon-tool";

// Loading component
function SPFVToolSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
      <Skeleton className="h-[250px] rounded-xl" />
    </div>
  );
}

// Main content component
async function SPFVContent({ user }: { user: User }) {
  // Get subscription data
  const { subscription } = await getActiveSubscription(user.id);
  const isUnsubscribed = subscription?.cancel_at_period_end === true;

  // Check if subscription is still in active period even if canceled
  const currentDate = new Date();
  const periodEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const isWithinActivePeriod = periodEndDate
    ? currentDate < periodEndDate
    : false;

  // User has access if subscription is active and within active period (even if unsubscribed)
  const hasAccess = subscription?.status === "active" && isWithinActivePeriod;

  return (
    <>
      {/* Subscription check card - shown only when not actively subscribed */}
      {!hasAccess && (
        <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-400">
                Premium Access Required
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                {isUnsubscribed && !isWithinActivePeriod
                  ? "Your subscription has ended. Renew now to regain access to Fair Value tools."
                  : "Subscribe to unlock the Fair Value Tool and full suite of analytics."}
              </p>
              <button className="mt-3 bg-amber-600 text-white hover:bg-amber-700 rounded px-3 py-1.5 text-sm font-medium">
                {isUnsubscribed ? "Renew Now" : "Upgrade Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active subscription access reminder - shown when unsubscribed but still has access */}
      {/* {isUnsubscribed && hasAccess && (
        <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-400">Access Expiring Soon</h3>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                You have access to all features until {formatDate(subscription?.current_period_end)}. 
                After this date, you&apos;ll lose access to Fair Value tools and analytics.
              </p>
              <button className="mt-3 bg-amber-600 text-white hover:bg-amber-700 rounded px-3 py-1.5 text-sm font-medium">
                Renew Subscription
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card
          className={`relative min-h-[250px] max-w-[400px] justify-between border overflow-hidden shadow hover:shadow-md transition-all duration-300 ${
            !hasAccess ? "opacity-75 pointer-events-none" : ""
          }`}
        >
          {/* <div className="absolute h-1 inset-x-0 top-0 bg-primary"></div> */}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary">SP Fair Value Calculator</CardTitle>
                <CardDescription>
                Calculates fair value for options based on historical data and relevant underlying conditions
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <SpfvIconTool />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/spfv/calculator" className="w-full">
              <button className="flex items-center justify-center w-full text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-md font-medium mt-2">
                Launch Tool
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
            {isUnsubscribed && hasAccess && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                Access until {formatDate(subscription?.current_period_end)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      {/* <Card
        className={`border overflow-hidden shadow hover:shadow-md transition-all duration-300 ${
          !hasAccess ? "opacity-75 pointer-events-none" : ""
        }`}
      >
        <div className="absolute h-1 inset-x-0 top-0 bg-primary"></div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Your previously generated Fair Value reports
              </CardDescription>
            </div>
            {hasAccess && !isUnsubscribed ? (
              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                <Check className="mr-1 h-3 w-3" /> Active
              </Badge>
            ) : hasAccess && isUnsubscribed ? (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Clock className="mr-1 h-3 w-3" /> Access until{" "}
                {formatDate(subscription?.current_period_end)}
              </Badge>
            ) : isUnsubscribed ? (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                <XCircle className="mr-1 h-3 w-3" /> Unsubscribed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-300"
              >
                <AlertCircle className="mr-1 h-3 w-3" /> Subscription Required
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasAccess ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sample Report</p>
                  <p className="text-xs text-muted-foreground">
                    Example Fair Value analysis report
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-center text-sm text-muted-foreground py-4">
                No more reports to display
              </div>
              {isUnsubscribed && (
                <p className="text-xs text-amber-600 text-center">
                  Access to reports until{" "}
                  {formatDate(subscription?.current_period_end)}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-center max-w-md px-4">
                <Lock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <h3 className="text-md font-medium mb-1">
                  Subscription Required
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isUnsubscribed
                    ? "Your subscription has ended. Renew now to regain access to Fair Value reports."
                    : "Upgrade your account to access Fair Value reports and analytics."}
                </p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                  {isUnsubscribed ? "Renew Now" : "Upgrade Now"}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}
    </>
  );
}

export default async function SpFvToolPage() {
  // Get user data
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">SP Fair Value Tool - pre-launch</h1>
          <p className="text-muted-foreground">
            Comprehensive Fair Value analytics and calculation tool.
          </p>
        </div>
      </div>

      <Suspense fallback={<SPFVToolSkeleton />}>
        <SPFVContent user={user} />
      </Suspense>
    </div>
  );
}
