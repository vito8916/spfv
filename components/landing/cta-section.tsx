import { CTAButton } from "@/components/landing/cta-button";

export function CTASection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            
            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="uppercase text-6xl tracking-tight font-extrabold text-gray-800 dark:text-white mb-6">
                        Ready to Start Your Trading Journey?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of traders who trust our platform for accurate fair value pricing and advanced trading tools.
                    </p>
                    <CTAButton title="Get Started" />
                </div>
            </div>
        </section>
    );
} 