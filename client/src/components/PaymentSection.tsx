import { ExternalLink, DollarSign } from "lucide-react";

const PAYMENT_PROVIDERS = [
  {
    name: "Cash App",
    envKey: "VITE_CASHAPP_URL",
    description: "Pay via Cash App ($Marlz720)",
    color: "oklch(0.72 0.22 145)",
    bg: "oklch(0.72 0.22 145 / 0.1)",
    border: "oklch(0.72 0.22 145 / 0.3)",
  },
  {
    name: "PayPal",
    envKey: "VITE_PAYPAL_URL",
    description: "Pay via PayPal",
    color: "oklch(0.65 0.15 240)",
    bg: "oklch(0.65 0.15 240 / 0.1)",
    border: "oklch(0.65 0.15 240 / 0.3)",
  },
  {
    name: "Stripe",
    envKey: "VITE_STRIPE_URL",
    description: "Pay via Stripe",
    color: "oklch(0.68 0.18 280)",
    bg: "oklch(0.68 0.18 280 / 0.1)",
    border: "oklch(0.68 0.18 280 / 0.3)",
  },
  {
    name: "Square",
    envKey: "VITE_SQUARE_URL",
    description: "Pay via Square",
    color: "oklch(0.72 0.18 185)",
    bg: "oklch(0.72 0.18 185 / 0.1)",
    border: "oklch(0.72 0.18 185 / 0.3)",
  },
] as const;

export default function PaymentSection() {
  return (
    <section id="payments" className="py-24">
      {/* Background accent */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.18 0.06 185 / 0.15) 0%, transparent 70%)",
        }}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "oklch(0.72 0.18 185)" }}
            >
              Secure &amp; Convenient
            </p>
            <h2
              className="font-display font-bold text-4xl md:text-5xl mb-4"
              style={{ color: "oklch(0.96 0.005 240)" }}
            >
              Payment Options
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p
              className="text-base max-w-lg mx-auto"
              style={{ color: "oklch(0.6 0.03 240)" }}
            >
              We accept multiple payment methods for your convenience. Choose
              whichever works best for you.
            </p>
          </div>

          {/* Payment cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PAYMENT_PROVIDERS.map((provider) => {
              const url = import.meta.env[provider.envKey] as string | undefined;
              const isConfigured = Boolean(url);

              const content = (
                <div
                  className="card-dark card-dark-hover p-6 flex flex-col items-center gap-3 text-center cursor-pointer"
                  style={{
                    background: provider.bg,
                    borderColor: provider.border,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: provider.bg, border: `1px solid ${provider.border}` }}
                  >
                    <DollarSign size={22} style={{ color: provider.color }} />
                  </div>
                  <span
                    className="font-display font-bold text-lg"
                    style={{ color: "oklch(0.96 0.005 240)" }}
                  >
                    {provider.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.03 240)" }}
                  >
                    {provider.description}
                  </span>
                  {isConfigured ? (
                    <span
                      className="flex items-center gap-1 text-xs font-medium mt-1"
                      style={{ color: provider.color }}
                    >
                      <ExternalLink size={12} />
                      {provider.name === "Cash App" ? "$Marlz720" : "Pay Now"}
                    </span>
                  ) : (
                    <span
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.45 0.02 240)" }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>
              );

              return isConfigured ? (
                <a
                  key={provider.name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <div key={provider.name}>{content}</div>
              );
            })}
          </div>

          {/* Note */}
          <p
            className="text-center text-xs mt-8"
            style={{ color: "oklch(0.45 0.02 240)" }}
          >
            Payment links are configured by the business owner. Contact us at{" "}
            <a
              href="tel:6206218934"
              style={{ color: "oklch(0.72 0.18 185)" }}
            >
              620-621-8934
            </a>{" "}
            for payment questions.
          </p>
        </div>
      </div>
    </section>
  );
}
