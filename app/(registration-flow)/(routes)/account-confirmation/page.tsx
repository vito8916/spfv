'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

const AccountConfirmationPage = () => {
    const plans = [
        {
            id: "basic",
            name: "Basic",
            price: "$29",
            description: "Perfect for getting started",
            features: [
                "Basic SPFV tools access",
                "Market analysis",
                "Community access",
                "Email support"
            ]
        },
        {
            id: "pro",
            name: "Pro",
            price: "$79",
            description: "Best for active traders",
            features: [
                "Advanced SPFV tools access",
                "Real-time market analysis",
                "Priority community access",
                "24/7 Priority support",
                "Custom alerts",
                "Advanced reporting"
            ],
            popular: true
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "$199",
            description: "For professional traders",
            features: [
                "Full SPFV suite access",
                "Real-time advanced analytics",
                "VIP community access",
                "Dedicated support team",
                "Custom integrations",
                "API access",
                "Team collaboration tools"
            ]
        }
    ];

    const [selectedPlan, setSelectedPlan] = useState("pro");

    const handleContinue = () => {
        // Handle the continuation with the selected plan
        console.log(`Continuing with plan: ${selectedPlan}`);
    };

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

            {/* Pricing Cards with Radio Selection */}
            <RadioGroup 
                defaultValue="pro" 
                value={selectedPlan} 
                onValueChange={setSelectedPlan}
                className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
                {plans.map((plan) => (
                    <div key={plan.id} className="relative">
                        <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="sr-only"
                        />
                        <Label
                            htmlFor={plan.id}
                            className="cursor-pointer block h-full"
                        >
                            <Card className={`flex flex-col h-full transition-all ${
                                selectedPlan === plan.id 
                                    ? 'border-primary shadow-lg scale-105' 
                                    : 'hover:border-primary/50'
                            }`}>
                                <CardHeader>
                                    {plan.popular && (
                                        <div className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full w-fit mb-4">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription>
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            {/* Continue Button */}
            <div className="text-center mt-8">
                <Button 
                    onClick={handleContinue}
                    className="bg-primary hover:bg-primary/90 px-8 py-2"
                    size="lg"
                >
                    Continue with {plans.find(p => p.id === selectedPlan)?.name} Plan
                </Button>
            </div>
        </div>
    );
};

export default AccountConfirmationPage;