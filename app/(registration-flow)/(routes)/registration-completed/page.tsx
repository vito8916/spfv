"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ArrowRight, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { updateRegistrationProgress } from "@/app/actions/registration";

export default function RegistrationCompleted() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Retrieve PDF URL from localStorage if available
    const storedPdfUrl = localStorage.getItem("opra_pdf_url");
    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl);
    }
  }, []);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Get the selected plan from localStorage
      const priceId = localStorage.getItem("selectedPlan");
      if (!priceId) {
        toast.error("Please select a subscription plan first");
        router.push("/account-confirmation");
        return;
      }

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Update registration progress
      const progressResult = await updateRegistrationProgress("registration_completed");
      if (!progressResult.success) {
        console.error("Failed to update registration progress:", progressResult.error);
        // Continue with checkout even if progress update fails
      }

      // Show success message before redirect
      toast.success("Redirecting to secure payment page...");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initiate checkout. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast.error("PDF URL not found. Please try again later.");
    }
  };

  return (
      <div className="container max-w-4xl mx-auto p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Registration Completed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for completing the registration process. You&apos;re almost ready to start!
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
          <CardDescription>
            Here&apos;s what you&apos;ve completed so far
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Account Creation</h3>
                <p className="text-muted-foreground">
                  Your account has been successfully created and verified
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Professional Status Questionnaire</h3>
                <p className="text-muted-foreground">
                  You&apos;ve completed the professional status assessment
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">OPRA Agreement</h3>
                    <p className="text-muted-foreground">
                      Your OPRA agreement has been generated and stored
                    </p>
                  </div>
                  {pdfUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPdf}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Final Step: Activate Your Subscription</CardTitle>
          <CardDescription>
            Complete your subscription to get full access to our platform&apos;s features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              "Processing..."
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 