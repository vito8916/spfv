"use client";

import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

// These exports ensure the page is never statically generated
export const dynamic = 'force-dynamic';

function SuccessPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    // Skip verification during build time
    if (typeof window === 'undefined') return;
    
    const verifySession = async () => {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setVerificationError("Invalid session ID");
        setIsVerifying(false);
        return;
      }

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
          toast.success("Subscription activated successfully!");
          localStorage.removeItem("selectedPlan");
          router.push("/dashboard");
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setVerificationError(
          error instanceof Error ? error.message : "Failed to verify payment"
        );
        toast.error("Failed to verify payment. Please contact support.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [searchParams, router]);

  return (
    <div className="container max-w-lg mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          {isVerifying ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <CardTitle>Verifying your payment...</CardTitle>
              <CardDescription>
                Please wait while we confirm your subscription.
              </CardDescription>
            </>
          ) : verificationError ? (
            <>
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
              <CardDescription>{verificationError}</CardDescription>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <CardTitle>Payment Successful!</CardTitle>
              <CardDescription>
                Your subscription has been activated.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <Button
            onClick={() =>
              router.push(verificationError ? "/account-confirmation" : "/dashboard")
            }
            className="min-w-[200px]"
          >
            {verificationError ? "Try Again" : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Fallback component to show while the main content is loading
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

export default function SuccessPaymentPage() {
  return (
    <Suspense fallback={<PaymentFallback />}>
      <SuccessPaymentContent />
    </Suspense>
  );
}
