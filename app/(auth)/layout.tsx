import Link from "next/link";
import React from "react";
import Logo from "@/components/logo";

export default function AuthCardLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium ">
                    <Logo />
                </Link>

                <div className="flex flex-col gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
}