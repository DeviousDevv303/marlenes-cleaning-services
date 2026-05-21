import { useState } from "react";
import { ShieldAlert, LogIn, Loader2 } from "lucide-react";
import {
  verifyAdminPassword,
  adminLogin,
  hasAdminPassword,
  setAdminPassword,
} from "@/lib/localStorage";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(!hasAdminPassword());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isFirstSetup) {
        await setAdminPassword(password);
        adminLogin();
        onLogin();
        toast.success("Admin password created!");
      } else {
        const valid = await verifyAdminPassword(password);
        if (valid) {
          adminLogin();
          onLogin();
        } else {
          setError("Incorrect password. Try again.");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {isFirstSetup ? "Create Admin Password" : "Admin Access"}
          </h2>
          <p
            className="text-sm mt-2"
            style={{ color: "oklch(0.6 0.03 240)" }}
          >
            {isFirstSetup
              ? "Set a secure password to access the admin panel."
              : "Enter your admin password to continue."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
              placeholder={isFirstSetup ? "Create password..." : "Enter password..."}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: "oklch(0.12 0.02 240)",
                border: "1px solid oklch(0.22 0.025 240)",
                color: "oklch(0.96 0.005 240)",
                outline: "none",
              }}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "oklch(0.55 0.22 25)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 6}
            className="btn-teal flex items-center justify-center gap-2 px-6 py-3 text-sm w-full disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {isFirstSetup ? "Create Password" : "Log In"}
          </button>
        </form>

        <a
          href="/marlenes-cleaning-services/"
          className="text-sm"
          style={{ color: "oklch(0.55 0.03 240)" }}
        >
          ← Back to site
        </a>
      </div>
    </div>
  );
}
