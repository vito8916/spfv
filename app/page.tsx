import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowRight, Check, Database, Settings, Github, Facebook, Twitter, MessageCircle} from "lucide-react";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {Metadata} from "next";
import Logo from "@/components/logo";

export const metadata: Metadata = {
    title: "Sp Fair Value",
    description: "A powerful tool for financial analysis and decision-making.",
    authors: [{name: "NSPRO'S", url: "https://nspros.io"}],
    openGraph: {
        title: "Sp Fair Value",
        description: "A powerful tool for financial analysis and decision-making.",
        url: "https://spfairvalue.com",
        siteName: "spfairvalue.com",
        images: [
            {
                url: "/supanext-kit.webp",
                width: 1200,
                height: 630,
                alt: "Sp Fair Value Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sp Fair Value",
        description: "A powerful tool for financial analysis and decision-making.",
        images: ["/supanext-kit.webp"],
    },
    metadataBase: new URL("https://spfairvalue.com"),
};

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-[url('/pattern-7.svg')] bg-cover opacity-50"/>
                <div className="relative z-10">
                    <header className="container mx-auto px-4 py-6">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Logo />
                                {/*<span className="text-xl font-bold">SpFairValue</span>*/}
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

            {/* Features Section */}
            <section className="py-20 bg-background-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">The Model That Increases</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Profits and trading performance
                            measurably.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="p-6 bg-background/50">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                <Settings className="h-6 w-6 text-primary"/>
                            </div>
                            <h3 className="text-xl font-bold mb-2">SPFV tools</h3>
                            <p className="text-muted-foreground mb-4">
                                This is the tool that we created
                                using proprietary algorithms that calculates the Fair Value of a strike.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-4 h-4">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 14.99c-1.73 1.05-3.5 1.63-5.01 1.63-1.51 0-3.28-.58-5.01-1.63-1.99-1.21-3.38-2.95-3.38-4.99 0-2.04 1.39-3.78 3.38-4.99 1.73-1.05 3.5-1.63 5.01-1.63 1.51 0 3.28.58 5.01 1.63 1.99 1.21 3.38 2.95 3.38 4.99 0 2.04-1.39 3.78-3.38 4.99z"/>
                                        <path
                                            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                                    </svg>
                                    Google
                                </div>
                                <div className="flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-md">
                                    <Github className="w-4 h-4"/>
                                    GitHub
                                </div>
                                <div className="flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-md">
                                    <Facebook className="w-4 h-4"/>
                                    Facebook
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-background/50">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                <Twitter className="h-6 w-6 text-primary"/>
                            </div>
                            <h3 className="text-xl font-bold mb-2">X (Twitter)</h3>
                            <p className="text-muted-foreground">
                                This is where we share you
                                our best ideas You then decide what suits your account.
                            </p>
                        </Card>

                        <Card className="p-6 bg-background/50">
                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                <MessageCircle className="h-6 w-6 text-primary"/>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Chat Room</h3>
                            <p className="text-muted-foreground">
                                This is where you can discuss
                                with your peers, ask a question
                                or comment about your positions, size , etc
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            Why Use Sp Fair Value?
                        </h2>
                        <div className="space-y-6">
                            {[
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
                            ].map((benefit) => (
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

            {/* Pricing Section */}
            <section className="py-20 bg-background-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern-7.svg')] bg-cover opacity-50"/>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Select the perfect plan for your trading needs and start maximizing your potential today.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
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
                        ].map((plan) => (
                            <Card key={plan.name} className={`flex flex-col h-full transition-all hover:scale-105 ${
                                plan.popular ? 'border-primary shadow-lg' : ''
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
                                <div className="px-6 mt-6">
                                    <Link href="/sign-up">
                                        <Button 
                                            className={`w-full ${
                                                plan.popular 
                                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                                    : 'bg-secondary hover:bg-secondary/80'
                                            }`}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready To Transform Your Trading?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join SP Fair Value today and experience the power of our
                        advanced fair value model. Start making more informed trading decisions.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                            Start Trading Smarter
                            <ArrowRight className="h-4 w-4"/>
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <Database className="h-4 w-4 text-primary-foreground"/>
                            </div>
                            <span className="text-xl font-bold">SpFairValue</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2024 SupaNextKit. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    );
}
