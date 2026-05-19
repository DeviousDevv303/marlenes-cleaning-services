import { useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SERVICE_TYPES = [
  "Deep Clean",
  "Move In/Out",
  "Home Clean",
  "Office/Business",
  "Post Construction",
  "Rental Turnover",
] as const;

type ServiceType = (typeof SERVICE_TYPES)[number];

interface FormState {
  name: string;
  phone: string;
  serviceType: ServiceType | "";
  preferredDate: string;
  address: string;
  notes: string;
}

const INITIAL: FormState = {
  name: "",
  phone: "",
  serviceType: "",
  preferredDate: "",
  address: "",
  notes: "",
};

export default function SchedulingSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.scheduling.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm(INITIAL);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceType) {
      toast.error("Please select a service type.");
      return;
    }
    submitMutation.mutate({
      name: form.name,
      phone: form.phone,
      serviceType: form.serviceType as ServiceType,
      preferredDate: form.preferredDate,
      address: form.address,
      notes: form.notes || undefined,
    });
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
          {/* Header */}
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
          </div>

          {submitted ? (
            /* Success state */
            <div
              className="card-dark p-10 text-center flex flex-col items-center gap-4 glow-teal"
            >
              <CheckCircle2 size={48} style={{ color: "oklch(0.72 0.18 185)" }} />
              <h3
                className="font-display font-bold text-2xl"
                style={{ color: "oklch(0.96 0.005 240)" }}
              >
                Request Received!
              </h3>
              <p style={{ color: "oklch(0.6 0.03 240)" }}>
                We'll reach out to confirm your appointment shortly. You can also
                call us at{" "}
                <a
                  href="tel:5804615110"
                  style={{ color: "oklch(0.72 0.18 185)" }}
                >
                  580-461-5110
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
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="card-dark p-8 flex flex-col gap-5"
            >
              {/* Name */}
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
                  placeholder="Marlene Moreno"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
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
                  placeholder="580-461-5110"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Service Type */}
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
                    Select a service…
                  </option>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
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

              {/* Address */}
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

              {/* Notes */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="btn-teal flex items-center justify-center gap-2 py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CalendarCheck size={18} />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
