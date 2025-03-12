'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PricingSkeleton } from '@/components/skeletons/pricing-skeleton';
import { useRouter } from 'next/navigation';
type Plan = {
    id: string;
    name: string;
    description: string;
    price: number;
    marketing_features: string[];
    interval: string;
    price_id: string;
};

const AccountConfirmationPage = () => {
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/stripe/subscription-plans');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch pricing plans');
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                
                setPlans(data);
                
                // Check localStorage for previously selected plan
                const storedPlanId = localStorage.getItem('selectedPlan');
                if (storedPlanId && data.some((plan: Plan) => plan.price_id === storedPlanId)) {
                    setSelectedPlan(storedPlanId);
                } else {
                    // If no stored plan or stored plan not found, select Fund-Market Maker Plan
                    const defaultPlan = data.find((plan: Plan) => 
                        plan.name.toLowerCase().includes('fund-market maker plan')
                    );
                    // If Fund-Market Maker plan not found, fallback to middle plan
                    if (defaultPlan) {
                        setSelectedPlan(defaultPlan.price_id);
                    } else if (data.length > 0) {
                        const middleIndex = Math.floor(data.length / 2);
                        setSelectedPlan(data[middleIndex].price_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
                setError(error instanceof Error ? error.message : 'Failed to load pricing plans');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleContinue = () => {
        // Save selected plan to localStorage for the signup process
        localStorage.setItem('selectedPlan', selectedPlan);
        // Redirect to additional data page
        router.push('/additional-data'); 
    };

    // Format price helper function
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price / 100);
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Success Message */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Account Successfully Confirmed!</h1>
                <p className="text-muted-foreground text-lg">
                    Welcome to SP Fair Value! Choose your plan to start maximizing your trading potential.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <PricingSkeleton /> 
                </div>
            ) : (
                <>
                    {/* Pricing Cards with Radio Selection */}
                    <RadioGroup 
                        value={selectedPlan} 
                        onValueChange={setSelectedPlan}
                        className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,350px))] gap-6 max-w-6xl mx-auto justify-center"
                    >
                        {plans.map((plan) => {
                            const isPopular = plan.name.toLowerCase().includes('fund-market maker plan');
                            
                            return (
                                <div key={plan.price_id} className="relative">
                                    <RadioGroupItem
                                        value={plan.price_id}
                                        id={plan.price_id}
                                        className="sr-only"
                                    />
                                    <Label
                                        htmlFor={plan.price_id}
                                        className="cursor-pointer block h-full"
                                    >
                                        <Card className={`flex flex-col h-full transition-all ${
                                            selectedPlan === plan.price_id 
                                                ? 'border-primary shadow-lg scale-105' 
                                                : 'hover:border-primary/50'
                                        }`}>
                                            <CardHeader>
                                                {isPopular && (
                                                    <div className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full w-fit mb-4">
                                                        Most Popular
                                                    </div>
                                                )}
                                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                                <CardDescription>
                                                    <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                                                    <span className="text-muted-foreground">/{plan.interval}</span>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <p className="text-muted-foreground mb-4">{plan.description}</p>
                                                <ul className="space-y-3">
                                                    {plan.marketing_features.map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-primary" />
                                                            <span className="text-sm">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>

                    {/* Continue Button */}
                    <div className="text-center mt-8">
                        <Button 
                            onClick={handleContinue}
                            className="bg-primary hover:bg-primary/90 px-8 py-2"
                            size="lg"
                            disabled={!selectedPlan}
                        >
                            Continue with {plans.find(p => p.price_id === selectedPlan)?.name} Plan
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccountConfirmationPage;