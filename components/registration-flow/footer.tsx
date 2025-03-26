import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";

const FooterRegistrationFlow = () => {
    const links = [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
                {/* Copyright */}
                <div className="text-center text-sm text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} SP Fair Value. All rights reserved.
                </div>

                {/* Links */}
                <nav className="flex items-center gap-4 md:gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
                        {/* TODO: Add social media links */}
                        <a href="https://x.com/spfairvalue" className="hover:underline">
                            X
                        </a>
                        <a href="https://www.instagram.com/spfairvalue" className="hover:underline">
                            Instagram
                        </a>
                        <a href="https://www.facebook.com/spfairvalue" className="hover:underline">
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterRegistrationFlow;