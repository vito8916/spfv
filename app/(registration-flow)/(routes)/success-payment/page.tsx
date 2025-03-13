"use client";

import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Prevent static generation
export const dynamic = 'force-dynamic';

// Loading fallback component
function PaymentFallback() {
  return (
    <div className="container max-w-lg mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <CardTitle>Loading payment verification...</CardTitle>
          <CardDescription>
            Please wait while we load the payment verification.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

// Main component with useSearchParams
function SuccessPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip verification during build time
    if (typeof window === 'undefined') return;
    
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('failed');
      setError("Invalid session ID");
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch("/api/stripe/check-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment verification failed");
        }

        if (data.status === "complete") {
          setStatus('success');
          toast.success("Subscription activated successfully!");
          localStorage.removeItem("selectedPlan");
          // Optional: auto-redirect after success
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus('failed');
        setError(error instanceof Error ? error.message : "Failed to verify payment");
        toast.error("Failed to verify payment. Please contact support.");
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="container max-w-lg mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <CardTitle>Verifying your payment...</CardTitle>
            <CardDescription>
              Please wait while we confirm your subscription.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container max-w-lg mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="text-destructive mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-destructive">Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6">
            <Button
              onClick={() => router.push("/account-confirmation")}
              className="min-w-[200px]"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-4" />
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            Your subscription has been activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <Button
            onClick={() => router.push("/dashboard")}
            className="min-w-[200px]"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Main export with Suspense boundary
export default function SuccessPaymentPage() {
  return (
    <Suspense fallback={<PaymentFallback />}>
      <SuccessPaymentContent />
    </Suspense>
  );
}
