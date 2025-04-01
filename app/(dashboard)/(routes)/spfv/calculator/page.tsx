import { getAuthUser } from "@/app/actions/auth";
import { getActiveSubscription } from "@/app/actions/subscriptions";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { OptionsCalculator } from "@/components/dashboard/spfv/options-calculator";

export default async function FairValueCalculatorPage() {
  // Get user data and check subscription
  const user = await getAuthUser();
  if (!user) {
    redirect("/sign-in");
  }
  
  // Get subscription data
  const { subscription } = await getActiveSubscription(user.id);
  const isUnsubscribed = subscription?.cancel_at_period_end === true;
  const currentDate = new Date();
  const periodEndDate = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const isWithinActivePeriod = periodEndDate ? currentDate < periodEndDate : false;
  const hasAccess = subscription?.status === 'active' && isWithinActivePeriod;
  
  // Redirect if no access
  if (!hasAccess) {
    redirect("/spfv");
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Fair Value Calculator</h1>
          <p className="text-muted-foreground">
            Calculate option fair values based on market data
          </p>
        </div>
        {isUnsubscribed && (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            Access until {formatDate(subscription?.current_period_end)}
          </Badge>
        )}
      </div>
      <OptionsCalculator />
    </div>
  );
} 