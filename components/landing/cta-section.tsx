import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            
            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Start Your Trading Journey?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of traders who trust our platform for accurate fair value pricing and advanced trading tools.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="group">
                            Get Started Today
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
} 