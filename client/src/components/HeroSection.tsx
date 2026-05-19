import { Phone, CalendarCheck } from "lucide-react";

interface HeroSectionProps {
  onScheduleClick: () => void;
}

export default function HeroSection({ onScheduleClick }: HeroSectionProps) {
  return (
    <section
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.06 185 / 0.35) 0%, oklch(0.08 0.01 240) 70%)",
      }}
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.18 185) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 185) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.72 0.18 185 / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container relative z-10 text-center pt-24 pb-16">
        {/* Business name */}
        <p
          className="animate-fade-in text-sm font-semibold tracking-[0.25em] uppercase mb-6"
          style={{
            color: "oklch(0.72 0.18 185)",
            animationDelay: "0.1s",
          }}
        >
          Down N&apos; Dirty Cleaning Services
        </p>

        {/* Headline */}
        <h1
          className="animate-fade-up font-display font-black leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            color: "oklch(0.96 0.005 240)",
            animationDelay: "0.2s",
          }}
        >
          WE CLEAN.{" "}
          <span
            className="text-glow-teal"
            style={{ color: "oklch(0.72 0.18 185)" }}
          >
            YOU RELAX.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-up text-lg md:text-xl font-light tracking-wide mb-12 max-w-xl mx-auto"
          style={{
            color: "oklch(0.65 0.03 240)",
            animationDelay: "0.35s",
          }}
        >
          Spotless spaces. Peace of mind.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <button
            onClick={onScheduleClick}
            className="btn-teal flex items-center gap-2 px-8 py-4 text-base animate-pulse-glow"
          >
            <CalendarCheck size={18} />
            Schedule Cleaning
          </button>

          <a
            href="tel:5804615110"
            className="btn-outline-teal flex items-center gap-2 px-8 py-4 text-base"
          >
            <Phone size={18} />
            Call Now — 580-461-5110
          </a>
        </div>

        {/* Starting price badge */}
        <p
          className="animate-fade-in mt-10 text-sm"
          style={{ color: "oklch(0.5 0.03 240)", animationDelay: "0.7s" }}
        >
          Residential &amp; Commercial &nbsp;·&nbsp; Starting at{" "}
          <span style={{ color: "oklch(0.72 0.18 185)" }}>$150</span>
        </p>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.08 0.01 240))",
        }}
      />
    </section>
  );
}
