import { useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import SchedulingSection from "@/components/SchedulingSection";
import PaymentSection from "@/components/PaymentSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const schedulingRef = useRef<HTMLDivElement>(null);

  const scrollToScheduling = () => {
    schedulingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.01 240)" }}>
      <Navbar onScheduleClick={scrollToScheduling} />
      <HeroSection onScheduleClick={scrollToScheduling} />
      <ServicesSection />
      <div ref={schedulingRef}>
        <SchedulingSection />
      </div>
      <PaymentSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
