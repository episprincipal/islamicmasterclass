import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { getRoleFromToken } from "../lib/auth";
// Removed banner image per request

/**
 * Scope mentions Login layout: left panel image + right panel form.:contentReference[oaicite:2]{index=2}
 * Styling aligned to emerald/gold/white design language.:contentReference[oaicite:3]{index=3}
 */

export default function Login() {
  const navigate = useNavigate();

  const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/auth/google`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      const token = res.data?.access_token;
      const user = res.data?.user;
      
      if (token) localStorage.setItem("imc_token", token);
      if (user) localStorage.setItem("imc_user", JSON.stringify(user));
      
      setMsg("✅ Login successful!");
      
      // Redirect based on role
      const role = getRoleFromToken();
      if (role === "admin") {
        setTimeout(() => navigate("/admin-dashboard"), 600);
      } else if (role === "parent") {
        setTimeout(() => navigate("/parent-dashboard"), 600);
      } else if (role === "student") {
        setTimeout(() => navigate("/student-dashboard"), 600);
      } else {
        setTimeout(() => navigate("/"), 600);
      }
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setMsg(`❌ ${detail}`);
    } finally {
      setLoading(false);
    }
  }

  function onGoogle() {
    if (!googleAuthUrl || googleAuthUrl === "/auth/google") {
      alert("Google sign-in URL is not configured. Set VITE_API_BASE_URL.");
      return;
    }
    window.location.href = googleAuthUrl;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
              <span className="text-sm font-semibold text-white">IMC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">IslamicMasterclass</div>
              <div className="text-xs text-slate-500">Learn • Practice • Grow</div>
            </div>
          </Link>

          <Link
            to="/signup"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="mx-auto px-4 py-10 flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md">
          {/* Centered login card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Login</h2>
            <p className="mt-1 text-sm text-slate-600">Enter your email and password.</p>

            {msg && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                {msg}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-slate-600 hover:text-slate-900"
                  onClick={() => alert("Hook this up to your forgot password flow later.")}
                >
                  Forgot Password?
                </button>

                <Link to="/signup" className="font-semibold text-emerald-700 hover:underline">
                  Create account
                </Link>
              </div>

              <div className="text-center">
                <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
                  ← Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
