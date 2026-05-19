import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

interface NavbarProps {
  onScheduleClick: () => void;
}

export default function Navbar({ onScheduleClick }: NavbarProps) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Services", href: "#services" },
    { label: "Schedule", href: "#schedule", action: onScheduleClick },
    { label: "Payments", href: "#payments" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "oklch(0.08 0.01 240 / 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid oklch(0.22 0.025 240)",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-2 font-display font-bold text-lg leading-tight"
          style={{ color: "oklch(0.96 0.005 240)" }}
        >
          <Sparkles
            size={20}
            style={{ color: "oklch(0.72 0.18 185)" }}
            className="shrink-0"
          />
          <span>
            Down N&apos; Dirty{" "}
            <span style={{ color: "oklch(0.72 0.18 185)" }}>Cleaning</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={
                l.action
                  ? (e) => {
                      e.preventDefault();
                      l.action!();
                    }
                  : undefined
              }
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: "oklch(0.6 0.03 240)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "oklch(0.72 0.18 185)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "oklch(0.6 0.03 240)")
              }
            >
              {l.label}
            </a>
          ))}
          <a href="tel:5804615110" className="btn-teal px-4 py-2 text-sm">
            Call Now
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md transition-colors"
          style={{ color: "oklch(0.72 0.18 185)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            background: "oklch(0.10 0.012 240)",
            borderColor: "oklch(0.22 0.025 240)",
          }}
        >
          <nav className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  setOpen(false);
                  if (l.action) {
                    e.preventDefault();
                    l.action();
                  }
                }}
                className="text-sm font-medium py-2"
                style={{ color: "oklch(0.75 0.03 240)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="tel:5804615110"
              className="btn-teal px-4 py-2 text-sm text-center mt-1"
              onClick={() => setOpen(false)}
            >
              Call Now — 580-461-5110
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
