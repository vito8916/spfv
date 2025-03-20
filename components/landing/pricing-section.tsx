'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PricingSkeleton } from "@/components/skeletons/pricing-skeleton";
import { useRouter } from "next/navigation";
type SubscriptionPlan = {
    id: string;
    name: string;
    description: string;
    price: number;
    marketing_features: string[];
    interval: string;
    price_id: string;
};


export function PricingSection() {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
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
            } catch (error) {
                console.error('Error fetching plans:', error);
                setError(error instanceof Error ? error.message : 'Failed to load pricing plans');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

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
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    const handleSubscribe = async (priceId: string) => {
       // save the priceId to local storage
       localStorage.setItem('selectedPlan', priceId);
       // redirect to the sign up page
       router.push('/sign-up');
      };

    return (
        <section className="py-20 bg-background-secondary relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern-7.svg')] bg-cover opacity-50"/>
            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="uppercase text-4xl tracking-tight font-extrabold text-gray-800 dark:text-white mb-4">Choose Your Plan</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Select the perfect plan for your trading needs and start maximizing your potential today.
                    </p>
                </div>

                {isLoading ? (
                    <PricingSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,350px))] gap-8 justify-center max-w-6xl mx-auto">
                        {plans.map((plan) => {
                            const isPopular = plan.name.toLowerCase().includes('fund-market maker plan');
                            
                            return (
                                <Card 
                                    key={plan.id} 
                                    className={`flex flex-col h-full transition-all duration-300 hover:scale-105 ${
                                        isPopular ? 'border-primary shadow-lg' : ''
                                    }`}
                                >
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
                                    <div className="p-6 mt-auto">
                                        <Link href="/sign-up">
                                            <Button 
                                                onClick={() => handleSubscribe(plan.price_id)}
                                                className={`w-full ${
                                                    isPopular 
                                                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                                        : 'bg-secondary hover:bg-secondary/80'
                                                }`}
                                            >
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
} 