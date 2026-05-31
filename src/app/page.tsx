import { MobileBuyBar } from "@/components/checkout/MobileBuyBar";
import { ViewContentTracker } from "@/components/landing/ViewContentTracker";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { GuaranteeSection } from "@/components/landing/GuaranteeSection";
import { GuideContentSection } from "@/components/landing/GuideContentSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { OfferSection } from "@/components/landing/OfferSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <ViewContentTracker />
      <main>
        <HeroSection />
        <BenefitsSection />
        <GuideContentSection />
        <TestimonialsSection />
        <OfferSection />
        <GuaranteeSection />
        <FaqSection />
      </main>
      <Footer />
      <MobileBuyBar />
    </>
  );
}
