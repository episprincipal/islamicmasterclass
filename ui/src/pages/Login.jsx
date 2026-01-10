import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ ADD THIS

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Login API call
      const res = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      // Save token
      const token = res.data.access_token || res.data.token;
      console.log("token"+token)
      localStorage.setItem("access_token", token);
      localStorage.setItem("imc_token", token);

      // Save user info if present
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      //if (token) localStorage.setItem("imc_token", token);

      const role = (res.data.user.role || "").toLowerCase();
      console.log("role"+role)
      if (role === "parent") navigate("/parent-dashboard");
      else if (role === "student") navigate("/student-dashboard");
      else navigate("/dashboard");

    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed. Check endpoint path + credentials.";

      setMsg("❌ " + detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: 36, margin: 0 }}>Islamic Masterclass</h1>
        <p style={{ marginTop: 12, opacity: 0.8 }}>
          Sign in to continue your learning.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ fontSize: 28, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: "#666", marginTop: 0, marginBottom: 18 }}>
            Use your existing seed data credentials.
          </p>

          {msg && (
            <div
              style={{
                background: msg.startsWith("❌") ? "#ffecec" : "#eaffea",
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: "#111",
                color: "#fff",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between" }}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Forgot Password
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
