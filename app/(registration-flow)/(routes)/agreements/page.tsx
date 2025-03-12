'use client'

import React, { useState } from 'react';
import { ShieldCheck } from "lucide-react";
import AgreementsForm from "@/components/registration-flow/agreements-form";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AgreementsPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAgreementsAccepted = async () => {
        try {
            setIsLoading(true);
            
            // Get the selected plan from localStorage
            const priceId = localStorage.getItem('selectedPlan');
            if (!priceId) {
                toast.error('Please select a subscription plan first');
                router.push('/account-confirmation');
                return;
            }

            // Create checkout session
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Show success message before redirect
            toast.success('Redirecting to secure payment page...');

            // Small delay to ensure the toast is seen
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to process subscription. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Review Agreements</h1>
                <p className="text-muted-foreground">
                    Please review and accept our terms and policies to continue with your subscription
                </p>
            </div>
            <AgreementsForm onAgreementsAccepted={handleAgreementsAccepted} isLoading={isLoading} />
        </div>
    );
};

export default AgreementsPage;