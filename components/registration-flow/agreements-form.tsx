'use client'

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ShieldCheck } from "lucide-react";
import { agreementsSchema, type AgreementsFormData } from "@/lib/validations/agreements";

const AgreementsForm = () => {
    const form = useForm<AgreementsFormData>({
        resolver: zodResolver(agreementsSchema),
        defaultValues: {
            termsAndConditions: false,
            privacyPolicy: false,
        },
        mode: "onChange", // Enable real-time validation
    });

    // Watch both checkbox values
    const termsAccepted = form.watch("termsAndConditions");
    const privacyAccepted = form.watch("privacyPolicy");
    
    // Button is enabled only when both checkboxes are checked
    const isSubmitEnabled = termsAccepted && privacyAccepted;

    const onSubmit = async (data: AgreementsFormData) => {
        try {
            console.log("Form submitted:", data);
            // TODO: Handle form submission
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6">
                    {/* Terms and Conditions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Terms and Conditions
                            </CardTitle>
                            <CardDescription>
                                Please read our terms and conditions carefully
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                <div className="text-sm text-muted-foreground">
                                    <h3 className="font-semibold text-foreground mb-2">1. Introduction</h3>
                                    <p className="mb-4">
                                        Welcome to SP Fair Value. By using our service, you agree to these terms. Please read them carefully.
                                    </p>
                                    <h3 className="font-semibold text-foreground mb-2">2. Use of Service</h3>
                                    <p className="mb-4">
                                        Our service provides financial analysis tools and fair value calculations. You must use these responsibly and in accordance with all applicable laws.
                                    </p>
                                    <h3 className="font-semibold text-foreground mb-2">3. Account Terms</h3>
                                    <p className="mb-4">
                                        You are responsible for maintaining the security of your account and any activities that occur under your account.
                                    </p>
                                    {/* Add more terms as needed */}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter>
                            <FormField
                                control={form.control}
                                name="termsAndConditions"
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
                                                I accept the terms and conditions
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardFooter>
                    </Card>

                    {/* Privacy Policy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5" />
                                Privacy Policy
                            </CardTitle>
                            <CardDescription>
                                Learn how we handle your data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                <div className="text-sm text-muted-foreground">
                                    <h3 className="font-semibold text-foreground mb-2">1. Data Collection</h3>
                                    <p className="mb-4">
                                        We collect information that you provide directly to us, including account information and usage data.
                                    </p>
                                    <h3 className="font-semibold text-foreground mb-2">2. Use of Data</h3>
                                    <p className="mb-4">
                                        We use your data to provide and improve our services, communicate with you, and ensure security.
                                    </p>
                                    <h3 className="font-semibold text-foreground mb-2">3. Data Protection</h3>
                                    <p className="mb-4">
                                        We implement appropriate security measures to protect your personal information.
                                    </p>
                                    {/* Add more privacy policy content as needed */}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter>
                            <FormField
                                control={form.control}
                                name="privacyPolicy"
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
                                                I accept the privacy policy
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardFooter>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        size="lg"
                        className="min-w-[200px]"
                        disabled={!isSubmitEnabled}
                    >
                        {isSubmitEnabled ? 'Continue' : 'Accept All Agreements to Continue'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AgreementsForm;
