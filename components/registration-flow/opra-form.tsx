"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ArrowRight, FileText, Loader2 } from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Data & Actions
import { updateUserAgreements } from "@/app/actions/users";
import { updateRegistrationProgress } from "@/app/actions/registration";
import { acceptTerms, getActiveTerms } from "@/app/actions/terms";



export default function OpraForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const router = useRouter();

  // Get user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  // Computed properties
  const isProfessional = userType !== "non-professional";
  const pdfLink = isProfessional
    ? "/legal-docs/opra-professional-subscriber-agreement.pdf"
    : "/legal-docs/OPRA_B-1_Draft.pdf";
  const pdfEndpoint = isProfessional
    ? "/api/pdf/fill-opra"
    : "/api/pdf/fill-opra-non-professional";
  const agreementTitle = isProfessional
    ? "Professional subscriber application and agreement"
    : "Non professional subscriber application and agreement";

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Get current user
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User not found");
      }

      // Generate PDF document
      const res = await fetch(pdfEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || "Failed to generate PDF");
      }

      // Store PDF URL and show success message
      localStorage.setItem("opra_pdf_url", response.pdfUrl);
      toast.success("OPRA Agreement generated successfully", {
        action: {
          label: "Download PDF",
          onClick: () => window.open(response.pdfUrl, "_blank"),
        },
      });

      // Update agreements in database
      const { success: updateSuccess, error: updateError } =
        await updateUserAgreements(true, true);
      if (!updateSuccess) {
        throw new Error(updateError || "Failed to update user agreements");
      }

      // Get appropriate term ID
      const term = await getActiveTerms(isProfessional ? "opra_professional" : "opra_non_professional");
      if (!term) {
        throw new Error("OPRA Agreement not found");
      }

      // Get appropriate term ID
      const termId = term.id;

      // Accept the terms
      const acceptSuccess = await acceptTerms(termId);
      if (!acceptSuccess) {
        throw new Error("Failed to accept term");
      }

      // Update registration progress
      const progressResult = await updateRegistrationProgress(
        "registration_completed"
      );
      if (!progressResult.success) {
        throw new Error(progressResult.error);
      }

      // Clear user type from localStorage
      localStorage.removeItem("userType");
      localStorage.removeItem("questionnaireAnswers");


      // Navigate to completion page
      router.push("/registration-completed");
    } catch (error) {
      console.error("Error submitting agreements:", error);
      toast.error("Failed to process your application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Market Data Agreements
          </CardTitle>
          <CardDescription>{agreementTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href={pdfLink}
            target="_blank"
            className="text-primary hover:underline"
          >
            <span className="flex items-center gap-2">
              OPRA Market Data Agreement
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            I understand that clicking the &quot;I agree&quot; button is the
            equivalent of my written signature on these Market Data Agreements
            and that I am entering into, agreeing to, completing, and/or signing
            all terms contained within the agreements.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement"
              checked={agreementAccepted}
              onCheckedChange={(checked) =>
                setAgreementAccepted(checked === true)
              }
            />
            <Label htmlFor="agreement" className="text-sm leading-none">
              I agree with the terms and conditions of the OPRA Market Data
              Agreement
            </Label>
          </div>

          <div className="w-full flex justify-end">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="min-w-[200px]"
              disabled={!agreementAccepted || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !agreementAccepted ? (
                "Accept the agreement to continue"
              ) : (
                "I agree"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
