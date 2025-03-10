import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Twitter } from "lucide-react";

const FooterRegistrationFlow = () => {
    const links = [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/contact", label: "Contact" },
    ];

    const socialLinks = [
        { href: "https://twitter.com/spfairvalue", icon: Twitter, label: "Twitter" },
        { href: "https://github.com/spfairvalue", icon: Github, label: "GitHub" },
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
                    {socialLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground/80"
                            >
                                <Icon className="h-4 w-4" />
                                <span className="sr-only">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
};

export default FooterRegistrationFlow;