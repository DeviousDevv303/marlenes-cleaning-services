import { useState } from "react";
import { Star, CheckCircle2, Loader2, MessageSquarePlus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const IS_STATIC_SITE = import.meta.env.VITE_STATIC_SITE === "true";
const BUSINESS_PHONE_DISPLAY = "580-461-5110";
const BUSINESS_PHONE_LINK = "5804615110";

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
        >
          <Star
            size={interactive ? 22 : 16}
            className={
              star <= (hovered || rating) ? "star-filled" : "star-empty"
            }
            fill={star <= (hovered || rating) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

interface ReviewFormState {
  reviewerName: string;
  rating: number;
  message: string;
}

const INITIAL_FORM: ReviewFormState = { reviewerName: "", rating: 5, message: "" };

export default function ReviewsSection() {
  const [form, setForm] = useState<ReviewFormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const approvedReviewsQuery = trpc.reviews.getApproved.useQuery(undefined, {
    enabled: !IS_STATIC_SITE,
  });
  const approvedReviews = IS_STATIC_SITE ? [] : approvedReviewsQuery.data;
  const isLoading = !IS_STATIC_SITE && approvedReviewsQuery.isLoading;

  const submitMutation = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm(INITIAL_FORM);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit review. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating < 1) {
      toast.error("Please select a star rating.");
      return;
    }

    if (IS_STATIC_SITE) {
      const body = [
        "Hi Down N' Dirty Cleaning Services, I would like to leave a review.",
        `Name: ${form.reviewerName}`,
        `Rating: ${form.rating}/5`,
        `Review: ${form.message}`,
      ].join("\n");
      window.location.href = `sms:${BUSINESS_PHONE_LINK}?&body=${encodeURIComponent(body)}`;
      setSubmitted(true);
      setForm(INITIAL_FORM);
      toast.success("Your review is ready to send by text message.");
      return;
    }

    submitMutation.mutate({
      reviewerName: form.reviewerName,
      rating: form.rating,
      message: form.message,
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
    <section id="reviews" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "oklch(0.72 0.18 185)" }}
          >
            Client Feedback
          </p>
          <h2
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            What Our Clients Say
          </h2>
          <div className="section-divider mx-auto" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin" style={{ color: "oklch(0.72 0.18 185)" }} />
          </div>
        ) : approvedReviews && approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {approvedReviews.map((review) => (
              <div key={review.id} className="card-dark card-dark-hover p-6 flex flex-col gap-3">
                <StarRating rating={review.rating} />
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  &ldquo;{review.message}&rdquo;
                </p>
                <div className="pt-3 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.72 0.18 185)" }}
                  >
                    — {review.reviewerName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 mb-16 card-dark rounded-xl"
            style={{ color: "oklch(0.5 0.03 240)" }}
          >
            <MessageSquarePlus size={40} className="mx-auto mb-3 opacity-40" />
            <p>No reviews yet — be the first to share your experience!</p>
          </div>
        )}

        <div className="max-w-xl mx-auto">
          <h3
            className="font-display font-bold text-2xl mb-6 text-center"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Leave a Review
          </h3>

          {submitted ? (
            <div className="card-dark p-8 text-center flex flex-col items-center gap-3 glow-teal">
              <CheckCircle2 size={40} style={{ color: "oklch(0.72 0.18 185)" }} />
              <h4
                className="font-display font-bold text-xl"
                style={{ color: "oklch(0.96 0.005 240)" }}
              >
                Thank You!
              </h4>
              <p style={{ color: "oklch(0.6 0.03 240)" }} className="text-sm">
                {IS_STATIC_SITE
                  ? "Your review text should be ready to send. If it did not open, call or text us at "
                  : "Your review has been submitted and is pending approval. We appreciate your feedback!"}
                {IS_STATIC_SITE ? (
                  <a href={`tel:${BUSINESS_PHONE_LINK}`} style={{ color: "oklch(0.72 0.18 185)" }}>
                    {BUSINESS_PHONE_DISPLAY}
                  </a>
                ) : null}
                {IS_STATIC_SITE ? "." : null}
              </p>
              <button
                className="btn-outline-teal px-5 py-2 text-sm mt-2"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-dark p-8 flex flex-col gap-5">
              <div>
                <label
                  htmlFor="reviewerName"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Your Name <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <input
                  id="reviewerName"
                  name="reviewerName"
                  type="text"
                  required
                  value={form.reviewerName}
                  onChange={(e) => setForm((p) => ({ ...p, reviewerName: e.target.value }))}
                  placeholder="Jane Smith"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Rating <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <StarRating
                  rating={form.rating}
                  interactive
                  onRate={(r) => setForm((p) => ({ ...p, rating: r }))}
                />
              </div>

              <div>
                <label
                  htmlFor="reviewMessage"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "oklch(0.75 0.03 240)" }}
                >
                  Your Review <span style={{ color: "oklch(0.72 0.18 185)" }}>*</span>
                </label>
                <textarea
                  id="reviewMessage"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your experience…"
                  className={inputClass}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="btn-teal flex items-center justify-center gap-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <MessageSquarePlus size={18} />
                    {IS_STATIC_SITE ? "Text Review" : "Submit Review"}
                  </>
                )}
              </button>

              <p
                className="text-xs text-center"
                style={{ color: "oklch(0.45 0.02 240)" }}
              >
                {IS_STATIC_SITE
                  ? "Reviews are sent directly by text message."
                  : "Reviews are moderated before appearing publicly."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
