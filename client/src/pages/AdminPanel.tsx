import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Star,
  LogOut,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  DollarSign,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";
import {
  clearAdminToken,
  deleteBooking,
  getAdminToken,
  getApiBaseUrl,
  listBookings,
  markBookingRetainerPaid,
  setAdminToken,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/api";
import {
  getPendingReviews,
  getApprovedReviews,
  moderateReview,
  deleteReview,
} from "@/lib/localStorage";
import type { Review } from "@/lib/localStorage";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          fill={s <= rating ? "currentColor" : "none"}
          className={s <= rating ? "text-yellow-400" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":");
  const hourNumber = Number(hours);
  const minuteNumber = Number(minutes ?? "0");

  if (!Number.isFinite(hourNumber) || !Number.isFinite(minuteNumber)) {
    return value;
  }

  const date = new Date();
  date.setHours(hourNumber, minuteNumber, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusStyle(status: BookingStatus) {
  if (status === "pending") {
    return {
      background: "oklch(0.72 0.18 80 / 0.15)",
      color: "oklch(0.85 0.18 80)",
      border: "1px solid oklch(0.72 0.18 80 / 0.3)",
    };
  }

  if (status === "confirmed") {
    return {
      background: "oklch(0.72 0.18 185 / 0.15)",
      color: "oklch(0.72 0.18 185)",
      border: "1px solid oklch(0.72 0.18 185 / 0.3)",
    };
  }

  if (status === "completed") {
    return {
      background: "oklch(0.55 0.22 140 / 0.15)",
      color: "oklch(0.65 0.22 140)",
      border: "1px solid oklch(0.55 0.22 140 / 0.3)",
    };
  }

  return {
    background: "oklch(0.55 0.22 25 / 0.12)",
    color: "oklch(0.65 0.22 25)",
    border: "1px solid oklch(0.55 0.22 25 / 0.3)",
  };
}

export default function AdminPanel() {
  const [token, setTokenState] = useState<string | null>(() => getAdminToken());
  const [activeTab, setActiveTab] = useState<"requests" | "reviews">("requests");
  const [requests, setRequests] = useState<Booking[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadDashboard() {
      setLoadingData(true);
      setLoadError("");

      try {
        const response = await listBookings(token);
        if (cancelled) return;
        setRequests(response.bookings);
        setPendingReviews(getPendingReviews());
        setApprovedReviews(getApprovedReviews());
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unable to load dashboard.";
        setLoadError(message);
        if (message.toLowerCase().includes("token")) {
          clearAdminToken();
          setTokenState(null);
          toast.error("Session expired. Please log in again.");
        }
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [token, refreshKey]);

  const handleLogin = (nextToken: string) => {
    setAdminToken(nextToken);
    setTokenState(nextToken);
    setRefreshKey((k) => k + 1);
  };

  const handleLogout = () => {
    clearAdminToken();
    setTokenState(null);
    setRequests([]);
    toast.success("Logged out successfully");
  };

  const refreshData = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleApiError = (err: unknown) => {
    const message = err instanceof Error ? err.message : "Backend request failed.";
    toast.error(message);
    if (message.toLowerCase().includes("token")) {
      clearAdminToken();
      setTokenState(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    if (!token) return;
    setActionId(`${id}:status`);
    try {
      await updateBookingStatus(token, id, status);
      refreshData();
      toast.success(`Request ${status}`);
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionId(null);
    }
  };

  const handleMarkRetainerPaid = async (id: string) => {
    if (!token) return;
    setActionId(`${id}:retainer`);
    try {
      await markBookingRetainerPaid(token, id);
      refreshData();
      toast.success("Retainer marked paid");
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!token || !confirm("Delete this request permanently?")) return;
    setActionId(`${id}:delete`);
    try {
      await deleteBooking(token, id);
      refreshData();
      toast.success("Request deleted");
    } catch (err) {
      handleApiError(err);
    } finally {
      setActionId(null);
    }
  };

  const handleModerateReview = (id: string, status: "approved" | "rejected") => {
    moderateReview(id, status);
    refreshData();
    toast.success(`Review ${status}`);
  };

  const handleDeleteReview = (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    deleteReview(id);
    refreshData();
    toast.success("Review deleted");
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const confirmedCount = requests.filter((r) => r.status === "confirmed").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const retainerCount = requests.filter((r) => r.retainerPaid).length;

  return (
    <div
      className="min-h-screen py-12"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      <div className="container max-w-5xl">
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
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
              Dashboard
            </h1>
            <p className="mt-2 text-sm" style={{ color: "oklch(0.6 0.03 240)" }}>
              Connected to {getApiBaseUrl()}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              disabled={loadingData}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-60"
              style={{
                background: "oklch(0.22 0.025 240)",
                color: "oklch(0.72 0.18 185)",
                border: "1px solid oklch(0.3 0.03 240)",
              }}
            >
              {loadingData ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{
                background: "oklch(0.22 0.025 240)",
                color: "oklch(0.6 0.03 240)",
                border: "1px solid oklch(0.3 0.03 240)",
              }}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>

        {loadError && (
          <div
            className="mb-6 rounded-lg p-4 text-sm"
            style={{
              background: "oklch(0.55 0.22 25 / 0.12)",
              color: "oklch(0.75 0.18 25)",
              border: "1px solid oklch(0.55 0.22 25 / 0.35)",
            }}
          >
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending", value: pendingCount, color: "oklch(0.85 0.18 80)" },
            { label: "Confirmed", value: confirmedCount, color: "oklch(0.72 0.18 185)" },
            { label: "Completed", value: completedCount, color: "oklch(0.65 0.22 140)" },
            { label: "Retainers Paid", value: retainerCount, color: "oklch(0.78 0.18 120)" },
          ].map((stat) => (
            <div key={stat.label} className="card-dark p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.03 240)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("requests")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background:
                activeTab === "requests"
                  ? "oklch(0.72 0.18 185 / 0.15)"
                  : "oklch(0.12 0.02 240)",
              color:
                activeTab === "requests"
                  ? "oklch(0.72 0.18 185)"
                  : "oklch(0.6 0.03 240)",
              border: `1px solid ${
                activeTab === "requests"
                  ? "oklch(0.72 0.18 185 / 0.4)"
                  : "oklch(0.22 0.025 240)"
              }`,
            }}
          >
            <Calendar size={16} className="inline mr-2" />
            Cleaning Requests ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background:
                activeTab === "reviews"
                  ? "oklch(0.72 0.18 185 / 0.15)"
                  : "oklch(0.12 0.02 240)",
              color:
                activeTab === "reviews"
                  ? "oklch(0.72 0.18 185)"
                  : "oklch(0.6 0.03 240)",
              border: `1px solid ${
                activeTab === "reviews"
                  ? "oklch(0.72 0.18 185 / 0.4)"
                  : "oklch(0.22 0.025 240)"
              }`,
            }}
          >
            <Star size={16} className="inline mr-2" />
            Reviews ({pendingReviews.length} pending)
          </button>
        </div>

        {activeTab === "requests" && (
          <div className="flex flex-col gap-4">
            {loadingData ? (
              <div
                className="card-dark p-12 text-center"
                style={{ color: "oklch(0.5 0.03 240)" }}
              >
                <Loader2 size={40} className="mx-auto mb-3 animate-spin opacity-60" />
                <p>Loading bookings...</p>
              </div>
            ) : requests.length === 0 ? (
              <div
                className="card-dark p-12 text-center"
                style={{ color: "oklch(0.5 0.03 240)" }}
              >
                <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                <p>No cleaning requests yet.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="card-dark p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: "oklch(0.72 0.18 185 / 0.15)" }}
                      >
                        <User size={20} style={{ color: "oklch(0.72 0.18 185)" }} />
                      </div>
                      <div>
                        <span
                          className="font-semibold text-base"
                          style={{ color: "oklch(0.96 0.005 240)" }}
                        >
                          {request.name}
                        </span>
                        <div
                          className="flex items-center gap-2 mt-1 text-xs flex-wrap"
                          style={{ color: "oklch(0.6 0.03 240)" }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Phone size={12} />
                            {request.phone}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Mail size={12} />
                            {request.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={statusStyle(request.status)}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background: request.retainerPaid
                            ? "oklch(0.55 0.22 140 / 0.15)"
                            : "oklch(0.22 0.025 240)",
                          color: request.retainerPaid
                            ? "oklch(0.65 0.22 140)"
                            : "oklch(0.6 0.03 240)",
                          border: request.retainerPaid
                            ? "1px solid oklch(0.55 0.22 140 / 0.35)"
                            : "1px solid oklch(0.3 0.03 240)",
                        }}
                      >
                        {request.retainerPaid ? "Retainer Paid" : "Retainer Pending"}
                      </span>
                      <button
                        onClick={() => void handleDeleteRequest(request.id)}
                        disabled={actionId === `${request.id}:delete`}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50"
                        style={{ color: "oklch(0.65 0.22 25)" }}
                        title="Delete request"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Service
                      </p>
                      <p style={{ color: "oklch(0.96 0.005 240)" }}>{request.serviceType}</p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Preferred Date
                      </p>
                      <p style={{ color: "oklch(0.96 0.005 240)" }}>
                        {formatDate(request.preferredDate)}
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Preferred Time
                      </p>
                      <p
                        className="inline-flex items-center gap-1.5"
                        style={{ color: "oklch(0.96 0.005 240)" }}
                      >
                        <Clock size={13} />
                        {formatTime(request.preferredTime)}
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Address
                      </p>
                      <p
                        className="inline-flex items-start gap-1.5"
                        style={{ color: "oklch(0.96 0.005 240)" }}
                      >
                        <MapPin size={13} className="mt-0.5 shrink-0" />
                        {request.address}
                      </p>
                    </div>
                  </div>

                  {request.notes && (
                    <p className="text-sm italic" style={{ color: "oklch(0.6 0.03 240)" }}>
                      &ldquo;{request.notes}&rdquo;
                    </p>
                  )}

                  <div
                    className="flex gap-3 pt-2 border-t flex-wrap"
                    style={{ borderColor: "oklch(0.22 0.025 240)" }}
                  >
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => void handleUpdateStatus(request.id, "confirmed")}
                          disabled={actionId === `${request.id}:status`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
                          style={{
                            background: "oklch(0.72 0.18 185 / 0.15)",
                            color: "oklch(0.72 0.18 185)",
                            border: "1px solid oklch(0.72 0.18 185 / 0.4)",
                          }}
                        >
                          <CheckCircle2 size={15} />
                          Confirm
                        </button>
                        <button
                          onClick={() => void handleUpdateStatus(request.id, "cancelled")}
                          disabled={actionId === `${request.id}:status`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
                          style={{
                            background: "oklch(0.55 0.22 25 / 0.12)",
                            color: "oklch(0.65 0.22 25)",
                            border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                          }}
                        >
                          <XCircle size={15} />
                          Decline
                        </button>
                      </>
                    )}

                    {request.status === "confirmed" && (
                      <button
                        onClick={() => void handleUpdateStatus(request.id, "completed")}
                        disabled={actionId === `${request.id}:status`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
                        style={{
                          background: "oklch(0.55 0.22 140 / 0.15)",
                          color: "oklch(0.65 0.22 140)",
                          border: "1px solid oklch(0.55 0.22 140 / 0.4)",
                        }}
                      >
                        <CheckCircle2 size={15} />
                        Mark Completed
                      </button>
                    )}

                    {!request.retainerPaid && (
                      <button
                        onClick={() => void handleMarkRetainerPaid(request.id)}
                        disabled={actionId === `${request.id}:retainer`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
                        style={{
                          background: "oklch(0.78 0.18 120 / 0.14)",
                          color: "oklch(0.78 0.18 120)",
                          border: "1px solid oklch(0.78 0.18 120 / 0.35)",
                        }}
                      >
                        <DollarSign size={15} />
                        Mark Retainer Paid
                      </button>
                    )}
                  </div>

                  <p className="text-xs" style={{ color: "oklch(0.45 0.02 240)" }}>
                    Submitted {formatDate(request.createdAt)} at{" "}
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4">
            <h3
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.72 0.18 185)" }}
            >
              Pending Moderation ({pendingReviews.length})
            </h3>
            {pendingReviews.length === 0 ? (
              <div
                className="card-dark p-8 text-center"
                style={{ color: "oklch(0.5 0.03 240)" }}
              >
                <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No pending reviews.</p>
              </div>
            ) : (
              pendingReviews.map((review) => (
                <div key={review.id} className="card-dark p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: "oklch(0.96 0.005 240)" }}>
                        {review.reviewerName}
                      </p>
                      <StarDisplay rating={review.rating} />
                    </div>
                    <span className="text-xs" style={{ color: "oklch(0.5 0.03 240)" }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "oklch(0.7 0.03 240)" }}>
                    {review.message}
                  </p>
                  <div
                    className="flex gap-3 pt-2 border-t"
                    style={{ borderColor: "oklch(0.22 0.025 240)" }}
                  >
                    <button
                      onClick={() => handleModerateReview(review.id, "approved")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: "oklch(0.55 0.22 140 / 0.15)",
                        color: "oklch(0.65 0.22 140)",
                        border: "1px solid oklch(0.55 0.22 140 / 0.4)",
                      }}
                    >
                      <ThumbsUp size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleModerateReview(review.id, "rejected")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: "oklch(0.55 0.22 25 / 0.12)",
                        color: "oklch(0.65 0.22 25)",
                        border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                      }}
                    >
                      <ThumbsDown size={14} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 rounded-lg ml-auto"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <h3
              className="text-sm font-semibold uppercase tracking-wider mt-6"
              style={{ color: "oklch(0.65 0.22 140)" }}
            >
              Approved Reviews ({approvedReviews.length})
            </h3>
            {approvedReviews.length === 0 ? (
              <div
                className="card-dark p-8 text-center"
                style={{ color: "oklch(0.5 0.03 240)" }}
              >
                <Star size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No approved reviews yet.</p>
              </div>
            ) : (
              approvedReviews.map((review) => (
                <div key={review.id} className="card-dark p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: "oklch(0.96 0.005 240)" }}>
                        {review.reviewerName}
                      </p>
                      <StarDisplay rating={review.rating} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "oklch(0.55 0.22 140 / 0.15)",
                          color: "oklch(0.65 0.22 140)",
                        }}
                      >
                        Approved
                      </span>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1.5 rounded-lg"
                        style={{ color: "oklch(0.65 0.22 25)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "oklch(0.7 0.03 240)" }}>
                    {review.message}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-8">
          <a
            href="/marlenes-cleaning-services/"
            className="text-sm"
            style={{ color: "oklch(0.55 0.03 240)" }}
          >
            Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
