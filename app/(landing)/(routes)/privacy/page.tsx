import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PlatformPrivacyContent from "@/components/shared/platform-privacy-content";

export const metadata = {
  title: "Privacy Policy | SP Fair Value",
  description:
    "Privacy Policy for SP Fair Value - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="uppercase text-5xl font-extrabold tracking-tight mb-6 text-gray-800 dark:text-white">
              <span className="text-gray-800 dark:text-gray-100">Privacy</span>
              <span className="text-primary"> Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <PlatformPrivacyContent />

            <div className="mt-16 flex justify-center">
              <Link href="/sign-up">
                <Button className="group flex items-center text-primary-foreground bg-primary hover:bg-primary/90 py-6 px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
