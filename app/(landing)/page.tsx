import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import ImagesCarousel from "@/components/landing/images-carousel";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection />
      <ImagesCarousel />
    </div>
  );
}
