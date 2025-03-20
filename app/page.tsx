import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import ImagesCarousel from "@/components/landing/images-carousel";

export default async function Home() {

    return (
        <div className="min-h-screen bg-background">
            <main>
                <HeroSection />
                <FeaturesSection />
                <BenefitsSection />
                <PricingSection />
                <CTASection />
                 <ImagesCarousel />
            </main>
            <Footer />
        </div>
    );
}
