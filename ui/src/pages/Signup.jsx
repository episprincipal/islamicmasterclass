import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { getRoleFromToken } from "../lib/auth";

/**
 * Scope says registration should register Parent or Student.:contentReference[oaicite:4]{index=4}
 * Styling aligned to emerald/gold/white.:contentReference[oaicite:5]{index=5}
 */

export default function Signup() {
  const navigate = useNavigate();

  const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1/auth/google`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("parent");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("❌ Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const [first_name, ...lastParts] = name.trim().split(' ');
      const last_name = lastParts.join(' ') || 'User';
      const res = await api.post("/api/v1/auth/register", {
        first_name,
        last_name,
        email,
        password,
        role_name: role,
        phone: null,
        dob: null,
        gender: null,
        address: null,
      });
      const token = res.data?.access_token;
      if (token) localStorage.setItem("imc_token", token);
      setMsg("✅ Account created! Redirecting to dashboard...");
      
      // Redirect based on role
      const userRole = getRoleFromToken();
      if (userRole === "parent") {
        setTimeout(() => navigate("/parent-dashboard"), 600);
      } else if (userRole === "student") {
        setTimeout(() => navigate("/student-dashboard"), 600);
      } else {
        setTimeout(() => navigate("/"), 600);
      }
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed";
      setMsg(`❌ ${detail}`);
    } finally {
      setLoading(false);
    }
  }

  function onGoogle() {
    if (!googleAuthUrl || googleAuthUrl === "/auth/google") {
      alert("Google sign-up URL is not configured. Set VITE_API_BASE_URL.");
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
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left info panel */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
              Parent & Student accounts
            </div>

            <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
            <p className="mt-2 text-slate-600">
              Choose a role and start learning with structured courses and progress tracking.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-700">
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">✅ Fast signup</div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">✅ Clear learning paths</div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">✅ Family progress overview</div>
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold">Sign Up</h2>
            <p className="mt-1 text-sm text-slate-600">Create your account to enroll in courses.</p>

            {msg && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                {msg}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

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
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
                  Login
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
