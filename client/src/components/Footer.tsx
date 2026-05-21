import { Phone, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{
        borderColor: "oklch(0.22 0.025 240)",
        background: "oklch(0.07 0.008 240)",
      }}
    >
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: "oklch(0.72 0.18 185)" }} />
          <span
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Marlene&apos;s Cleaning Services
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-5 text-sm">
          {["#services", "#schedule", "#payments", "#reviews"].map((href) => (
            <a
              key={href}
              href={href}
              className="capitalize transition-colors duration-150"
              style={{ color: "oklch(0.55 0.03 240)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "oklch(0.72 0.18 185)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "oklch(0.55 0.03 240)")
              }
            >
              {href.replace("#", "")}
            </a>
          ))}
        </nav>

        {/* Phone */}
        <a
          href="tel:5804615110"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "oklch(0.72 0.18 185)" }}
        >
          <Phone size={15} />
          580-461-5110
        </a>
      </div>

      <p
        className="text-center text-xs mt-6"
        style={{ color: "oklch(0.4 0.02 240)" }}
      >
        &copy; {new Date().getFullYear()} Marlene&apos;s Cleaning Services. All rights reserved.
      </p>
    </footer>
  );
}
