import { CheckCircle2, XCircle, Loader2, ShieldAlert, Star, LogIn } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "star-filled" : "star-empty"}
          fill={s <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: pendingReviews, isLoading: reviewsLoading } =
    trpc.reviews.listPending.useQuery(undefined, {
      enabled: user?.role === "admin",
    });

  const moderateMutation = trpc.reviews.moderate.useMutation({
    onSuccess: (_, vars) => {
      toast.success(
        vars.status === "approved" ? "Review approved!" : "Review rejected."
      );
      utils.reviews.listPending.invalidate();
      utils.reviews.getApproved.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Action failed. Please try again.");
    },
  });

  /* ── Auth loading ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.01 240)" }}
      >
        <Loader2 size={36} className="animate-spin" style={{ color: "oklch(0.72 0.18 185)" }} />
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.01 240)" }}
      >
        <div className="card-dark p-10 text-center max-w-sm mx-auto flex flex-col items-center gap-4">
          <ShieldAlert size={40} style={{ color: "oklch(0.72 0.18 185)" }} />
          <h2
            className="font-display font-bold text-2xl"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Admin Access
          </h2>
          <p style={{ color: "oklch(0.6 0.03 240)" }} className="text-sm">
            You must be logged in as the owner to access this panel.
          </p>
          <a
            href={getLoginUrl()}
            className="btn-teal flex items-center gap-2 px-6 py-3 text-sm"
          >
            <LogIn size={16} />
            Log In
          </a>
        </div>
      </div>
    );
  }

  /* ── Not admin ── */
  if (user.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.08 0.01 240)" }}
      >
        <div className="card-dark p-10 text-center max-w-sm mx-auto flex flex-col items-center gap-4">
          <ShieldAlert size={40} style={{ color: "oklch(0.55 0.22 25)" }} />
          <h2
            className="font-display font-bold text-2xl"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Access Denied
          </h2>
          <p style={{ color: "oklch(0.6 0.03 240)" }} className="text-sm">
            This panel is restricted to the business owner.
          </p>
          <a href="/" className="btn-outline-teal px-5 py-2 text-sm">
            Back to Site
          </a>
        </div>
      </div>
    );
  }

  /* ── Admin view ── */
  return (
    <div
      className="min-h-screen py-12"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-2"
            style={{ color: "oklch(0.72 0.18 185)" }}
          >
            Owner Panel
          </p>
          <h1
            className="font-display font-bold text-4xl"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Review Moderation
          </h1>
          <p className="mt-2 text-sm" style={{ color: "oklch(0.6 0.03 240)" }}>
            Approve or reject submitted reviews before they appear publicly.
          </p>
          <div className="section-divider mt-4" />
        </div>

        {/* Pending reviews */}
        {reviewsLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin" style={{ color: "oklch(0.72 0.18 185)" }} />
          </div>
        ) : pendingReviews && pendingReviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="card-dark p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span
                      className="font-semibold text-base"
                      style={{ color: "oklch(0.96 0.005 240)" }}
                    >
                      {review.reviewerName}
                    </span>
                    <div className="mt-1">
                      <StarDisplay rating={review.rating} />
                    </div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "oklch(0.72 0.18 80 / 0.15)",
                      color: "oklch(0.85 0.18 80)",
                      border: "1px solid oklch(0.72 0.18 80 / 0.3)",
                    }}
                  >
                    Pending
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.7 0.03 240)" }}
                >
                  &ldquo;{review.message}&rdquo;
                </p>

                <p
                  className="text-xs"
                  style={{ color: "oklch(0.45 0.02 240)" }}
                >
                  Submitted {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
                  <button
                    onClick={() =>
                      moderateMutation.mutate({ id: review.id, status: "approved" })
                    }
                    disabled={moderateMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-60"
                    style={{
                      background: "oklch(0.72 0.18 185 / 0.15)",
                      color: "oklch(0.72 0.18 185)",
                      border: "1px solid oklch(0.72 0.18 185 / 0.4)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "oklch(0.72 0.18 185 / 0.25)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "oklch(0.72 0.18 185 / 0.15)")
                    }
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      moderateMutation.mutate({ id: review.id, status: "rejected" })
                    }
                    disabled={moderateMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-60"
                    style={{
                      background: "oklch(0.55 0.22 25 / 0.12)",
                      color: "oklch(0.65 0.22 25)",
                      border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "oklch(0.55 0.22 25 / 0.22)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "oklch(0.55 0.22 25 / 0.12)")
                    }
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="card-dark p-12 text-center"
            style={{ color: "oklch(0.5 0.03 240)" }}
          >
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-40" />
            <p>No pending reviews. You&apos;re all caught up!</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8">
          <a
            href="/"
            className="text-sm"
            style={{ color: "oklch(0.55 0.03 240)" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "oklch(0.72 0.18 185)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "oklch(0.55 0.03 240)")
            }
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
