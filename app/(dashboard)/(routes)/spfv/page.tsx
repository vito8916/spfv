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
  BarChart3,
} from "lucide-react";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import SpfvIconTool from "@/components/shared/spfv-icon-tool";

// Loading component
function SPFVToolSkeleton() {
  return (
    <div className="flex flex-1 gap-4 p-4 pt-0">
      <Skeleton className="h-[280px] w-[360px] rounded-xl" />
      <Skeleton className="h-[280px] w-[360px] rounded-xl" />
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
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        {/* Calculator Card */}
        <Card
          className={`relative min-h-[280px] max-w-[400px] justify-between border overflow-hidden shadow hover:shadow-md transition-all duration-300 ${
            !hasAccess ? "opacity-75 pointer-events-none" : ""
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-1.5"></div>
                  <div className="h-1.5 w-3 rounded-full bg-primary mr-1.5"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                </div>
                <CardTitle className="text-2xl font-bold text-primary mt-2">SP Fair Value Calculator</CardTitle>
                <CardDescription>
                  Calculates fair value for options based on historical data and relevant underlying conditions
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-3 shadow-sm">
              <div className="text-primary/50">
                <SpfvIconTool />
              </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex">
                <div className="h-2 w-8 rounded-full bg-primary/30 mr-1"></div>
                <div className="h-2 w-5 rounded-full bg-primary/20 mr-1"></div>
                <div className="h-2 w-3 rounded-full bg-primary/10"></div>
              </div>
            </div>
            <Link href="/spfv/options" className="w-full">
              <button className="flex items-center justify-center w-full text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-md font-medium mt-2 transition-colors">
                Launch SP Fair Value
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

        {/* Screener Card */}
        <Card
          className={`relative min-h-[280px] max-w-[400px] justify-between border overflow-hidden shadow hover:shadow-md transition-all duration-300 ${
            !hasAccess ? "opacity-75 pointer-events-none" : ""
          }`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_40%,#f0f1f5_40%,#f0f1f5_60%,transparent_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,transparent_0%,transparent_40%,#2a2f3a_40%,#2a2f3a_60%,transparent_60%,transparent_100%)] opacity-[0.15] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full pointer-events-none"></div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <div className="h-1.5 w-3 rounded-full bg-primary mr-1.5"></div>
                  <div className="h-1.5 w-3 rounded-full bg-primary"></div>
                </div>
                <CardTitle className="text-2xl font-bold text-primary mt-2">SP Stock Screener</CardTitle>
                <CardDescription>
                  Find the best SP stocks based on fair value and relevant underlying conditions
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-3 shadow-sm">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-4 gap-1 mb-4">
              <div className="h-2 w-full rounded-full bg-primary/10"></div>
              <div className="h-2 w-full rounded-full bg-primary/20"></div>
              <div className="h-2 w-full rounded-full bg-primary/30"></div>
              <div className="h-2 w-full rounded-full bg-primary/40"></div>
            </div>
            <Link href="/spfv/screener" className="w-full">
              <button className="flex items-center justify-center w-full text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-2 rounded-md font-medium mt-2 transition-colors">
                Launch Screener
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
