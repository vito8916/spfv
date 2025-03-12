import { Database } from "lucide-react";

export function Footer() {
    return (
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
                        © {new Date().getFullYear()} SpFairValue. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
} 