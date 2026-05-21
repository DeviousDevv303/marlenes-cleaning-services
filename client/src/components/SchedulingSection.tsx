import { useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBooking } from "@/lib/api";

const SERVICE_TYPES = [
  "Deep Clean",
  "Move In/Out",
  "Home Clean",
  "Office/Business",
  "Post Construction",
  "Rental Turnover",
] as const;

const BUSINESS_PHONE_DISPLAY = "620-621-8934";
const BUSINESS_PHONE_LINK = "6206218934";
const OWNER_EMAIL = "towerslutz@gmail.com";

type ServiceType = (typeof SERVICE_TYPES)[number];

interface FormState {
  name: string;
  phone: string;
  email: string;
  serviceType: ServiceType | "";
  preferredDate: string;
  preferredTime: string;
  address: string;
  notes: string;
}

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  preferredDate: "",
  preferredTime: "",
  address: "",
  notes: "",
};

function bookingMessage(form: FormState): string {
  return [
    "Hi Marlene's Cleaning Services, I would like to schedule a cleaning.",
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email}`,
    `Service: ${form.serviceType}`,
    `Preferred date: ${form.preferredDate}`,
    `Preferred time: ${form.preferredTime}`,
    `Address: ${form.address}`,
    form.notes ? `Notes: ${form.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSmsUrl(form: FormState): string {
  return `sms:${BUSINESS_PHONE_LINK}?&body=${encodeURIComponent(bookingMessage(form))}`;
}

function openEmailFallback(form: FormState): void {
  const subject = encodeURIComponent(`New Cleaning Request - ${form.name}`);
  const body = encodeURIComponent(`${bookingMessage(form)}\n\nSent from Marlene's website`);
  window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`, "_blank", "noopener");
}

export default function SchedulingSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceType) {
      toast.error("Please select a service type.");
      return;
    }

    setLoading(true);

    try {
      const result = await createBooking({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service_type: form.serviceType,
        preferred_date: form.preferredDate,
        preferred_time: form.preferredTime,
        address: form.address,
        notes: form.notes || undefined,
      });

      setSubmitted(true);
      setForm(INITIAL);
      toast.success(
        result.emailSent
          ? "Request sent. Marlene will confirm your booking soon."
          : "Request saved. Marlene will follow up soon."
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      window.location.href = buildSmsUrl(form);
      window.setTimeout(() => openEmailFallback(form), 500);
      toast.error(`Booking server error: ${message}. Opening text and email backup.`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-150 focus:ring-2";
  const inputStyle = {
    background: "oklch(0.13 0.018 240)",
    border: "1px solid oklch(0.22 0.025 240)",
    color: "oklch(0.96 0.005 240)",
  };

  return (
    <section id="schedule" className="py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "oklch(0.72 0.18 185)" }}
            >
              Book a Clean
            </p>
            <h2
              className="font-display font-bold text-4xl md:text-5xl mb-4"
              style={{ color: "oklch(0.96 0.005 240)" }}
            >
              Schedule a Cleaning
            </h2>
            <div className="section-divider mx-auto" />
            <p
              className="text-base max-w-lg mx-auto"
              style={{ color: "oklch(0.6 0.03 240)" }}
            >
              Request a cleaning appointment. We'll confirm within 24 hours.
            </p>
            <p
              className="text-xs font-semibold tracking-wide mt-2"
              style={{ color: "oklch(0.72 0.18 185)" }}
            >
              Serious inquiries only - $50 retainer required to confirm booking.
            </p>
          </div>

          {submitted ? (
            <div className="card-dark p-10 text-center flex flex-col items-center gap-4 glow-teal">
              <CheckCircle2 size={48} style={{ color: "oklch(0.72 0.18 185)" }} />
              <h3
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.96 0.005 240)" }}
              >
                Request Submitted
              </h3>
              <p style={{ color: "oklch(0.6 0.03 240)" }}>
                Your request was sent to Marlene's Cleaning Services. If you need to add
                details, call or text{" "}
                <a
                  href={`tel:${BUSINESS_PHONE_LINK}`}
                  style={{ color: "oklch(0.72 0.18 185)" }}
                >
                  {BUSINESS_PHONE_DISPLAY}
                </a>
                .
              </p>
              <button
                className="btn-outline-teal px-6 py-2 text-sm mt-2"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-dark p-8 flex flex-col gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Full Name <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "oklch(0.75 0.03 240)" }}
                  >
                    Phone Number <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={BUSINESS_PHONE_DISPLAY}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "oklch(0.75 0.03 240)" }}
                  >
                    Email <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Service Type <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={form.serviceType}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Select a service...
                  </option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "oklch(0.75 0.03 240)" }}
                  >
                    Preferred Date <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    value={form.preferredDate}
                    onChange={handleChange}
                    className={inputClass}
                    style={{
                      ...inputStyle,
                      colorScheme: "dark",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferredTime"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "oklch(0.75 0.03 240)" }}
                  >
                    Preferred Time <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                  </label>
                  <input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    required
                    value={form.preferredTime}
                    onChange={handleChange}
                    className={inputClass}
                    style={{
                      ...inputStyle,
                      colorScheme: "dark",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Service Address <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions, access codes, pets, etc."
                  className={inputClass}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-teal flex items-center justify-center gap-2 py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CalendarCheck size={18} />
                    Submit Request
                  </>
                )}
              </button>

              <p className="text-xs text-center" style={{ color: "oklch(0.5 0.03 240)" }}>
                Marlene will receive your request by email and follow up to confirm.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
