"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SuccessPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          toast.error("Invalid session");
          router.push("/account-confirmation");
          return;
        }

        const response = await fetch("/api/stripe/check-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        if (data.status === "complete") {
          toast.success("Subscription activated successfully!");
          // Clear the selected plan from localStorage
          localStorage.removeItem("selectedPlan");
          // Redirect to dashboard or welcome page
          //router.push("/dashboard");
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment. Please contact support.");
        router.push("/account-confirmation");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <div className="container max-w-lg mx-auto p-6">
      <div className="text-center space-y-4">
        {isVerifying ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold">Verifying your payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your subscription.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your subscription has been activated.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="mt-4"
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
