import { Check } from "lucide-react";

const benefits = [
    {
        title: "Advanced Trading Tools",
        description:
            "Access powerful SPFV tools and algorithms for precise fair value calculations",
    },
    {
        title: "Real-time Analysis",
        description:
            "Get instant market insights and fair value calculations to make informed decisions",
    },
    {
        title: "Community Support",
        description:
            "Join a thriving community of traders and get support when you need it",
    },
    {
        title: "Professional Platform",
        description:
            "Built with modern technology to ensure reliability and performance",
    },
];

export function BenefitsSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Why Use Sp Fair Value?
                    </h2>
                    <div className="space-y-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex gap-4 items-start">
                                <div
                                    className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-4 w-4 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">{benefit.title}</h3>
                                    <p className="text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
} 