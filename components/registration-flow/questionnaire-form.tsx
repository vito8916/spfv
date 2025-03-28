"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  questionnaireSchema,
  type QuestionnaireFormData,
} from "@/lib/validations/questionnaire";
import { saveQuestionnaireAnswers } from "@/app/actions/questionnaire";
import { Checkbox } from "@/components/ui/checkbox";
import { updateRegistrationProgress } from "@/app/actions/registration";
import { createClient } from "@/utils/supabase/client";
import QuestionnaireSkeleton from "@/components/skeletons/questionnaire-skeleton";

const professionalQuestions = [
  {
    id: "isInvestmentAdvisor",
    question:
      'Are you engaged as an "investment advisor" as that term is defined in Section 202(a)(11) of the Investment Advisors Act of 19420 (whether or not registered or qualified under that act?',
  },
  {
    id: "isUsingForBusiness",
    question:
      "Are you using data for a business, professional, or other commercial purpose not compatible with noon-professional status?",
  },
  {
    id: "isReceivingBenefits",
    question:
      "Are you receiving office space and equipment or other benefits in exchange for your trading or work as a financial consultant to any person, firm, or business entity?",
  },
  {
    id: "isListedAsFinancialProfessional",
    question:
      "Do you list yourself as employed by a financial services firm on LinkedIn, Facebook, or Twitter?",
  },
  {
    id: "isRegisteredWithRegulator",
    question:
      "Are you registered/qualified with any state, federal, or international securities exchange or self-regulatory body including the SEC, CFTC, any securities/exchange association, or and commodities/futures contract market/association?",
  },
  {
    id: "isEngagedInFinancialServices",
    question:
      "Are you engaged in financial services business or employed as a financial advisor or acting on behalf of an institution that engages in brokerage, banking, investment, or financial activities?",
  },
  {
    id: "isTradingForOrganization",
    question:
      "Is your trading activity related to a corporation, partnership, or similar organization whereby the primary purpose is to trade for the benefit of the organization?",
  },
  {
    id: "isContractedForPrivateUse",
    question:
      "Are you in contract for, or do you receive or use information for private use on behalf of any other person, corporation, partnership, LLC, or other form of entity?",
  },
  {
    id: "isUsingOthersCapital",
    question:
      "Do you use the capital of any other individual or entity in the conduct of your trading?",
  },
  {
    id: "isPerformingRegulatedFunctions",
    question:
      "If outside the US, do you perform any functions that are similar to those that would require an individual to register with the SEC, CFTC, or any other securities/exchange or association?",
  },
  {
    id: "isAssociatedWithFirm",
    question:
      "Are you, your spouse, or any other immediate family members, including parents, in-laws, siblings, and dependents employed by or associated with our firm?",
  },
  {
    id: "isAssociatedWithPublicCompany",
    question:
      "Are you, your spouse, or any other immediate family members, including parents, in-laws, siblings, and dependents an officer, director or 10% (or more) shareholder in publicly owned company?",
  },
  {
    id: "isAssociatedWithBrokerDealer",
    question:
      "Are you, your spouse, or any other immediate family members, including parents, in-laws, siblings, and dependents employed by or associated with any other registered broker/dealer or a financial regulatory agency?",
  },
];



const QuestionnaireForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const supabase = createClient();

  // Initialize form with default values
  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      isNonProfessional: true,
      isInvestmentAdvisor: false,
      isUsingForBusiness: false,
      isReceivingBenefits: false,
      isListedAsFinancialProfessional: false,
      isRegisteredWithRegulator: false,
      isEngagedInFinancialServices: false,
      isTradingForOrganization: false,
      isContractedForPrivateUse: false,
      isUsingOthersCapital: false,
      isPerformingRegulatedFunctions: false,
      isAssociatedWithFirm: false,
      isAssociatedWithPublicCompany: false,
      isAssociatedWithBrokerDealer: false,
      isAccurateAndComplete: false,
    },
  });

  useEffect(() => {
    const storedAnswers = localStorage.getItem('questionnaireAnswers');
    
    if (storedAnswers) {
      try {
        const parsedAnswers = JSON.parse(storedAnswers);
        const formattedAnswers = Object.fromEntries(
          Object.entries(parsedAnswers).map(([key, value]) => {
            return [key, typeof value === 'string' ? value === 'true' : value];
          })
        );
        form.reset(formattedAnswers);
      } catch (error) {
        console.error('Error parsing stored questionnaire answers:', error);
        localStorage.removeItem('questionnaireAnswers');
      }
    }
    
    // Set form as ready after loading stored answers
    setIsFormReady(true);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        localStorage.setItem('questionnaireAnswers', JSON.stringify(values));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const onSubmit = async (data: QuestionnaireFormData) => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Save questionnaire answers
      const result = await saveQuestionnaireAnswers(data);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Clear stored answers after successful submission
      localStorage.removeItem('questionnaireAnswers');

      toast.success("Questionnaire submitted successfully");

      // Generate and store PDF based on professional status
      const pdfEndpoint = data.isNonProfessional 
        ? "/api/pdf/fill-opra-non-professional" 
        : "/api/pdf/fill-opra";

      const res = await fetch(pdfEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || "Failed to generate PDF");
      }

      // Store PDF URL and show success message with download option
      localStorage.setItem("opra_pdf_url", response.pdfUrl);
      toast.success("OPRA Agreement generated successfully", {
        action: {
          label: 'Download PDF',
          onClick: () => {
            window.open(response.pdfUrl, "_blank");
          }
        },
      });

      // Update registration progress to registration_completed
      const progressResult = await updateRegistrationProgress("registration_completed");
      if (!progressResult.success) {
        throw new Error(progressResult.error);
      }

      // Show completion message
      toast.success("Registration process completed!");

      // Small delay to ensure the toasts are seen
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the next step
      router.push("/registration-completed");
    } catch (error) {
      console.error("Error in questionnaire submission:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit questionnaire. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return isFormReady ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Professional Status</CardTitle>
            <CardDescription>
              Please answer the following questions to determine your
              professional status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="isNonProfessional"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Is the subscriber a natural person who will receive market
                    data solely for his/her own personal, non-business use?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value === "true");
                      }}
                      value={field.value ? "true" : "false"}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Questions</CardTitle>
            <CardDescription>
              Please answer all the following questions as they apply to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {professionalQuestions.map((q) => (
              <FormField
                key={q.id}
                control={form.control}
                name={q.id as keyof QuestionnaireFormData}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{q.question}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value ? "true" : "false"}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <FormField
              control={form.control}
              name="isAccurateAndComplete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I confirm that the information provided above is accurate
                      and complete
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="min-w-[200px]"
            disabled={isLoading || !form.watch("isAccurateAndComplete")}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  ) : (
    <QuestionnaireSkeleton />
  );
};

export default QuestionnaireForm;
