import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import {Metadata} from "next";


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

export default async function Home() {

    return (
        <div className="min-h-screen bg-background">
            <main>
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <PricingSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
