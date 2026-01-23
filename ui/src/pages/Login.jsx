import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { getRoleFromToken } from "../lib/auth";

/**
 * Scope mentions Login layout: left panel image + right panel form.:contentReference[oaicite:2]{index=2}
 * Styling aligned to emerald/gold/white design language.:contentReference[oaicite:3]{index=3}
 */

export default function Login() {
  const navigate = useNavigate();

  const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/auth/google`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      const token = res.data?.access_token;
      if (token) localStorage.setItem("imc_token", token);
      setMsg("✅ Login successful!");
      
      // Redirect based on role
      const role = getRoleFromToken();
      if (role === "parent") {
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

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left image panel */}
          <div className="overflow-hidden rounded-2xl bg-slate-50 shadow-sm ring-1 ring-slate-200">
            <div
              className="h-full min-h-[340px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=70)",
              }}
              aria-hidden="true"
            />
            <div className="p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                Spiritual tone • Minimal design
              </div>
              <div className="mt-3 text-sm text-slate-600">
                Login to continue your learning journey and access your dashboard.
              </div>
            </div>
          </div>

          {/* Right form */}
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
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

            <div className="mt-6 text-xs text-slate-500">
              If login returns <b>404</b>, your endpoint might be different. We’ll confirm from Swagger next.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
