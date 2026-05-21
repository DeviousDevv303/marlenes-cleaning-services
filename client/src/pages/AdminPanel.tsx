import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Star,
  LogOut,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";
import {
  isAdminLoggedIn,
  adminLogout,
} from "@/lib/localStorage";
import {
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  getPendingReviews,
  getApprovedReviews,
  moderateReview,
  deleteReview,
  seedDemoData,
} from "@/lib/localStorage";
import type { CleaningRequest, Review } from "@/lib/localStorage";

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

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [activeTab, setActiveTab] = useState<"requests" | "reviews">("requests");
  const [requests, setRequests] = useState<CleaningRequest[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load data on mount and when refreshKey changes
  useEffect(() => {
    if (loggedIn) {
      seedDemoData(); // Seed demo data if empty
      setRequests(getAllRequests());
      setPendingReviews(getPendingReviews());
      setApprovedReviews(getApprovedReviews());
    }
  }, [loggedIn, refreshKey]);

  const handleLogin = () => {
    setLoggedIn(true);
    setRefreshKey((k) => k + 1);
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
    toast.success("Logged out successfully");
  };

  const refreshData = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = (id: string, status: CleaningRequest["status"]) => {
    updateRequestStatus(id, status);
    refreshData();
    toast.success(`Request ${status}`);
  };

  const handleDeleteRequest = (id: string) => {
    if (!confirm("Delete this request permanently?")) return;
    deleteRequest(id);
    refreshData();
    toast.success("Request deleted");
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

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div
      className="min-h-screen py-12"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      <div className="container max-w-5xl">
        {/* Header */}
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
              Manage cleaning requests and reviews.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                background: "oklch(0.22 0.025 240)",
                color: "oklch(0.72 0.18 185)",
                border: "1px solid oklch(0.3 0.03 240)",
              }}
            >
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending", value: pendingCount, color: "oklch(0.85 0.18 80)" },
            { label: "Confirmed", value: requests.filter((r) => r.status === "confirmed").length, color: "oklch(0.72 0.18 185)" },
            { label: "Completed", value: requests.filter((r) => r.status === "completed").length, color: "oklch(0.65 0.22 140)" },
            { label: "Reviews Pending", value: pendingReviews.length, color: "oklch(0.72 0.18 185)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-dark p-4 text-center"
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.03 240)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
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

        {/* Cleaning Requests Tab */}
        {activeTab === "requests" && (
          <div className="flex flex-col gap-4">
            {requests.length === 0 ? (
              <div
                className="card-dark p-12 text-center"
                style={{ color: "oklch(0.5 0.03 240)" }}
              >
                <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                <p>No cleaning requests yet.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="card-dark p-6 flex flex-col gap-4"
                >
                  {/* Request Header */}
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
                        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "oklch(0.6 0.03 240)" }}>
                          <Phone size={12} />
                          {request.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background:
                            request.status === "pending"
                              ? "oklch(0.72 0.18 80 / 0.15)"
                              : request.status === "confirmed"
                              ? "oklch(0.72 0.18 185 / 0.15)"
                              : request.status === "completed"
                              ? "oklch(0.55 0.22 140 / 0.15)"
                              : "oklch(0.55 0.22 25 / 0.12)",
                          color:
                            request.status === "pending"
                              ? "oklch(0.85 0.18 80)"
                              : request.status === "confirmed"
                              ? "oklch(0.72 0.18 185)"
                              : request.status === "completed"
                              ? "oklch(0.65 0.22 140)"
                              : "oklch(0.65 0.22 25)",
                          border: `1px solid ${
                            request.status === "pending"
                              ? "oklch(0.72 0.18 80 / 0.3)"
                              : request.status === "confirmed"
                              ? "oklch(0.72 0.18 185 / 0.3)"
                              : request.status === "completed"
                              ? "oklch(0.55 0.22 140 / 0.3)"
                              : "oklch(0.55 0.22 25 / 0.3)"
                          }`,
                        }}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                        style={{ color: "oklch(0.65 0.22 25)" }}
                        title="Delete request"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Service Details */}
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
                        {new Date(request.preferredDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg col-span-2"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Address
                      </p>
                      <p style={{ color: "oklch(0.96 0.005 240)" }}>{request.address}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {request.notes && (
                    <p className="text-sm italic" style={{ color: "oklch(0.6 0.03 240)" }}>
                      &ldquo;{request.notes}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  {request.status === "pending" && (
                    <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
                      <button
                        onClick={() => handleUpdateStatus(request.id, "confirmed")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
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
                        onClick={() => handleUpdateStatus(request.id, "cancelled")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                        style={{
                          background: "oklch(0.55 0.22 25 / 0.12)",
                          color: "oklch(0.65 0.22 25)",
                          border: "1px solid oklch(0.55 0.22 25 / 0.35)",
                        }}
                      >
                        <XCircle size={15} />
                        Decline
                      </button>
                    </div>
                  )}

                  {request.status === "confirmed" && (
                    <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
                      <button
                        onClick={() => handleUpdateStatus(request.id, "completed")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                        style={{
                          background: "oklch(0.55 0.22 140 / 0.15)",
                          color: "oklch(0.65 0.22 140)",
                          border: "1px solid oklch(0.55 0.22 140 / 0.4)",
                        }}
                      >
                        <CheckCircle2 size={15} />
                        Mark Completed
                      </button>
                    </div>
                  )}

                  <p className="text-xs" style={{ color: "oklch(0.45 0.02 240)" }}>
                    Submitted {new Date(request.createdAt).toLocaleDateString()} at{" "}
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-4">
            {/* Pending Reviews */}
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "oklch(0.72 0.18 185)" }}>
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
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "oklch(0.7 0.03 240)" }}>
                    {review.message}
                  </p>
                  <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "oklch(0.22 0.025 240)" }}>
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

            {/* Approved Reviews */}
            <h3 className="text-sm font-semibold uppercase tracking-wider mt-6" style={{ color: "oklch(0.65 0.22 140)" }}>
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

        {/* Back link */}
        <div className="mt-8">
          <a
            href="/marlenes-cleaning-services/"
            className="text-sm"
            style={{ color: "oklch(0.55 0.03 240)" }}
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
