import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldAlert,
  Star,
  LogIn,
  LogOut,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";
import {
  isAdminLoggedIn,
  adminLogout,
} from "@/lib/adminAuth";

interface CleaningRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  preferredDate: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

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

// Mock data for demonstration - replace with actual API calls
const mockRequests: CleaningRequest[] = [
  {
    id: "1",
    name: "Jane Smith",
    phone: "620-555-0101",
    email: "jane@example.com",
    address: "123 Main St, Wichita, KS",
    serviceType: "Deep Cleaning",
    bedrooms: "3",
    bathrooms: "2",
    preferredDate: "2026-05-25",
    notes: "First time cleaning, need thorough service",
    status: "pending",
    createdAt: "2026-05-21",
  },
];

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [activeTab, setActiveTab] = useState<"requests" | "reviews">("requests");
  const [requests, setRequests] = useState<CleaningRequest[]>(mockRequests);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
    toast.success("Logged out successfully");
  };

  const updateRequestStatus = (
    id: string,
    status: CleaningRequest["status"]
  ) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    toast.success(`Request ${status}`);
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div
      className="min-h-screen py-12"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      <div className="container max-w-4xl">
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
            Cleaning Requests ({requests.filter((r) => r.status === "pending").length})
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
            Reviews
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
                          {request.email && (
                            <>
                              <Mail size={12} />
                              {request.email}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
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
                        Bedrooms
                      </p>
                      <p style={{ color: "oklch(0.96 0.005 240)" }}>{request.bedrooms}</p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "oklch(0.12 0.02 240)" }}
                    >
                      <p className="text-xs mb-1" style={{ color: "oklch(0.5 0.03 240)" }}>
                        Bathrooms
                      </p>
                      <p style={{ color: "oklch(0.96 0.005 240)" }}>{request.bathrooms}</p>
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
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm" style={{ color: "oklch(0.7 0.03 240)" }}>
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{request.address}</span>
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
                        onClick={() => updateRequestStatus(request.id, "confirmed")}
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
                        onClick={() => updateRequestStatus(request.id, "cancelled")}
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

                  <p className="text-xs" style={{ color: "oklch(0.45 0.02 240)" }}>
                    Submitted {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div
            className="card-dark p-12 text-center"
            style={{ color: "oklch(0.5 0.03 240)" }}
          >
            <Star size={40} className="mx-auto mb-3 opacity-40" />
            <p>Review moderation coming soon.</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-8">
          <a
            href="/"
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
