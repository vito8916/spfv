// components/settings/billing-overview.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Receipt, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/utils";
import { getActiveSubscription } from "@/app/actions/subscriptions";
import type { Subscription } from "@/app/actions/subscriptions";

interface BillingOverviewProps {
  userId: string;
}

export function BillingOverview({ userId }: BillingOverviewProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const result = await getActiveSubscription(userId);
        if (result.success && result.subscription) {
          setSubscription(result.subscription);
        }
      } catch (error) {
        console.error('Error loading subscription details:', error);
        toast.error("Failed to load subscription details");
      } finally {
        setIsLoading(false);
      }
    }

    loadSubscription();
  }, [userId]);

  const handlePortalAccess = async () => {
    try {
      setIsPortalLoading(true);
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Failed to access billing portal');
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <CardTitle>Subscription Overview</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">
                {subscription?.metadata?.plan || 'No active plan'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {subscription?.status || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Period</p>
              <p className="text-sm text-muted-foreground">
                {subscription ? (
                  `${formatDate(subscription.current_period_start)} - ${formatDate(subscription.current_period_end)}`
                ) : (
                  'N/A'
                )}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm text-muted-foreground">
                {subscription ? formatDate(subscription.current_period_end) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Payment Method</CardTitle>
          </div>
          <CardDescription>
            Your current payment method and billing address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handlePortalAccess}
            disabled={isPortalLoading}
            className="w-full sm:w-auto"
          >
            {isPortalLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Billing in Stripe Portal
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}