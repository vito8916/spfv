import { getAuthUser } from "@/app/actions/auth";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/utils";
import { redirect } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { getActiveSubscription } from "@/app/actions/subscriptions";
import HeaderOptions from "@/components/dashboard/spfv/options/option-header";

export default async function OptionsPage() {
  // Get user data and check subscription
  const user = await getAuthUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Get subscription data
  const { subscription } = await getActiveSubscription(user.id);
  const isUnsubscribed = subscription?.cancel_at_period_end === true;
  const currentDate = new Date();
  const periodEndDate = subscription?.current_period_end
      ? new Date(subscription.current_period_end)
      : null;
  const isWithinActivePeriod = periodEndDate
      ? currentDate < periodEndDate
      : false;
  const hasAccess = subscription?.status === "active" && isWithinActivePeriod;

  // Redirect if no access
  if (!hasAccess) {
    redirect("/spfv");
  }

  return (
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold">SP Fair Value</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Calculate option fair values based on market data
            </p>
          </div>
          {isUnsubscribed && (
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center w-fit">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span className="text-xs sm:text-sm">Access until {formatDate(subscription?.current_period_end)}</span>
              </Badge>
          )}
        </div>
        <div className="w-full overflow-x-auto">
          <HeaderOptions />
        </div>
      </div>
  );
}
