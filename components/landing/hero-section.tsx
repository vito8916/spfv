import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-[url('/pattern-7.svg')] bg-cover opacity-50"/>
            <div className="relative z-10">
                <header className="container mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Logo />
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </header>

                <main className="container mx-auto px-4 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            What Sam{" "}
                            <span className="text-primary">Developed</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            A model that generates fair value prices for Options, and delivers the opportunity to
                            increase profits and improve trading performance measurably called SP Fair Value.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/sign-up">
                                <Button size="lg"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                                    Get Started
                                    <ArrowRight className="h-4 w-4"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 