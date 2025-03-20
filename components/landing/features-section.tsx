import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, MessageSquare, TrendingUp } from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="uppercase text-4xl font-bold mb-4 text-gray-800">Amplify Your Investment Potential</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Smart tools that measurably boost your trading performance and profits.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <BarChart3 className="h-7 w-7 text-primary"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">SPFV Tools</h3>
                        <p className="text-muted-foreground mb-6">
                            Our proprietary algorithms calculate the exact Fair Value of any strike, giving you a competitive edge in the market.
                        </p>
                        <div className="mt-auto">
                            <button className="group flex items-center text-primary font-medium">
                                Explore tools
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </Card>

                    <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <TrendingUp className="h-7 w-7 text-primary"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Market Insights</h3>
                        <p className="text-muted-foreground mb-6">
                            Get real-time trading ideas and market analysis curated specifically for ambitious young investors.
                        </p>
                        <div className="mt-auto">
                            <button className="group flex items-center text-primary font-medium">
                                View insights
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </Card>

                    <Card className="p-8 bg-background/60 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <MessageSquare className="h-7 w-7 text-primary"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Community</h3>
                        <p className="text-muted-foreground mb-6">
                            Connect with like-minded traders to discuss strategies, positions, and investment opportunities in real-time.
                        </p>
                        <div className="mt-auto">
                            <button className="group flex items-center text-primary font-medium">
                                Join community
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
} 