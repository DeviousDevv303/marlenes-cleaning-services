import {
  Sparkles,
  PackageOpen,
  Home,
  Building2,
  HardHat,
  KeyRound,
} from "lucide-react";

const SERVICES = [
  {
    icon: Sparkles,
    title: "Deep Clean",
    description:
      "A thorough top-to-bottom clean that reaches every corner, surface, and fixture — perfect for seasonal resets or first-time cleans.",
  },
  {
    icon: PackageOpen,
    title: "Move In / Out",
    description:
      "Leave your old place spotless or arrive to a fresh start. We handle every surface so you can focus on your move.",
  },
  {
    icon: Home,
    title: "Home Clean",
    description:
      "Regular maintenance cleaning tailored to your schedule — weekly, bi-weekly, or monthly — keeping your home consistently pristine.",
  },
  {
    icon: Building2,
    title: "Office / Business",
    description:
      "Professional commercial cleaning that keeps your workspace presentable, hygienic, and ready to impress clients and staff alike.",
  },
  {
    icon: HardHat,
    title: "Post Construction",
    description:
      "Dust, debris, and residue removed after renovation or new construction, leaving the space move-in ready and immaculate.",
  },
  {
    icon: KeyRound,
    title: "Rental Turnover",
    description:
      "Fast, reliable turnovers for Airbnb, VRBO, and rental properties — maximizing your 5-star ratings and guest satisfaction.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "oklch(0.72 0.18 185)" }}
          >
            What We Offer
          </p>
          <h2
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Our Services
          </h2>
          <div className="section-divider mx-auto mb-4" />
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "oklch(0.6 0.03 240)" }}
          >
            Every service starts at{" "}
            <span style={{ color: "oklch(0.72 0.18 185)" }}>$150</span>. Final
            pricing based on size and scope.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="card-dark card-dark-hover p-6 flex flex-col gap-4"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "oklch(0.72 0.18 185 / 0.12)",
                    border: "1px solid oklch(0.72 0.18 185 / 0.3)",
                  }}
                >
                  <Icon size={22} style={{ color: "oklch(0.72 0.18 185)" }} />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="font-display font-bold text-xl mb-2"
                    style={{ color: "oklch(0.96 0.005 240)" }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.6 0.03 240)" }}
                  >
                    {svc.description}
                  </p>
                </div>

                {/* Price badge */}
                <div className="mt-auto pt-4 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.72 0.18 185)" }}
                  >
                    from $150
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
