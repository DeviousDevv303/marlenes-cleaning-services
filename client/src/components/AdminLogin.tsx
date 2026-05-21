import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl, getHealth, loginAdmin } from "@/lib/api";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let cancelled = false;

    async function checkBackend() {
      try {
        await getHealth();
        if (!cancelled) setBackendStatus("online");
      } catch {
        if (!cancelled) setBackendStatus("offline");
      }
    }

    void checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(username, password);
      onLogin(result.token);
      toast.success("Logged in successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to log in.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "oklch(0.12 0.02 240)",
    border: "1px solid oklch(0.22 0.025 240)",
    color: "oklch(0.96 0.005 240)",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      <div className="card-dark p-8 md:p-10 text-center max-w-sm mx-auto flex flex-col items-center gap-5 w-full">
        <ShieldAlert size={40} style={{ color: "oklch(0.72 0.18 185)" }} />
        <div>
          <h2
            className="font-display font-bold text-2xl"
            style={{ color: "oklch(0.96 0.005 240)" }}
          >
            Admin Access
          </h2>
          <p
            className="text-sm mt-2"
            style={{ color: "oklch(0.6 0.03 240)" }}
          >
            Sign in with the backend admin account.
          </p>
          <div
            className="mt-4 rounded-lg px-3 py-2 text-xs flex items-center justify-center gap-2"
            style={{
              background: backendStatus === "offline"
                ? "oklch(0.55 0.22 25 / 0.12)"
                : "oklch(0.12 0.02 240)",
              color: backendStatus === "online"
                ? "oklch(0.72 0.18 185)"
                : backendStatus === "offline"
                  ? "oklch(0.75 0.18 25)"
                  : "oklch(0.6 0.03 240)",
              border: `1px solid ${
                backendStatus === "offline"
                  ? "oklch(0.55 0.22 25 / 0.35)"
                  : "oklch(0.22 0.025 240)"
              }`,
            }}
          >
            {backendStatus === "online" && <CheckCircle2 size={14} />}
            {backendStatus === "offline" && <AlertTriangle size={14} />}
            {backendStatus === "checking" && <Loader2 size={14} className="animate-spin" />}
            <span>
              {backendStatus === "online"
                ? "Backend online"
                : backendStatus === "offline"
                  ? "Backend offline or not deployed"
                  : "Checking backend"}
            </span>
          </div>
          <p className="mt-2 text-[11px]" style={{ color: "oklch(0.45 0.02 240)" }}>
            API: {getApiBaseUrl()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="admin-username"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.6 0.03 240)" }}
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle}
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="admin-password"
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(0.6 0.03 240)" }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "oklch(0.55 0.22 25)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="btn-teal flex items-center justify-center gap-2 px-6 py-3 text-sm w-full disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            Log In
          </button>
        </form>

        <a
          href="/marlenes-cleaning-services/"
          className="text-sm"
          style={{ color: "oklch(0.55 0.03 240)" }}
        >
          Back to site
        </a>
      </div>
    </div>
  );
}
