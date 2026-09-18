import HeroSection from "@/components/home/HeroSection";
import TrustMarquee from "@/components/home/TrustMarquee";
import SLATrustStrip from "@/components/home/SLATrustStrip";
import SchoolSMSGuite from "@/components/home/SchoolSMSGuite";
import ServicesGrid from "@/components/home/ServicesGrid";
import TechStack from "@/components/home/TechStack";
import ERPSandbox from "@/components/home/ERPSandbox";
import ProductShowcase from "@/components/home/ProductShowcase";
import BIAuditEngine from "@/components/home/BIAuditEngine";
import IndustryHub from "@/components/home/IndustryHub";
import ROICalculator from "@/components/home/ROICalculator";
import BrochureShowcase from "@/components/home/BrochureShowcase";
import Testimonials from "@/components/home/Testimonials";
import FAQAccordion from "@/components/home/FAQAccordion";
import StatsCounter from "@/components/home/StatsCounter";

export default function Home() {
  return (
    <>
      <HeroSection />

      <StatsCounter />

      <TrustMarquee />

      <SLATrustStrip />

      <ProductShowcase />

      <SchoolSMSGuite />

      <IndustryHub />

      <ServicesGrid />

      <BIAuditEngine />

      <TechStack />

      <ERPSandbox />

      <ROICalculator />

      <BrochureShowcase />

      <Testimonials />

      <FAQAccordion />
    </>
  );
}
