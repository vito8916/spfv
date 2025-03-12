import { Card } from "@/components/ui/card";
import { Settings, Twitter, MessageCircle, Github, Facebook } from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="py-20 bg-background-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">The Model That Increases</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Profits and trading performance measurably.
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
    );
} 