import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [msg, setMsg] = useState("");

  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState(""); // will set after roles load

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // New fields
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // yyyy-mm-dd
  const [gender, setGender] = useState(""); // "male" | "female" | "other" | ""
  const [address, setAddress] = useState("");

  const selectedRole = useMemo(
    () => roles.find((r) => r.role_name === roleName) || null,
    [roles, roleName]
  );

  useEffect(() => {
    let ignore = false;

    async function loadRoles() {
      setMsg("");
      setLoadingRoles(true);
      try {
        // ✅ your requested endpoint
        const res = await api.get("/api/v1/roles");
        const data = res.data;
        const list = Array.isArray(data) ? data : (data?.items ?? []);

        if (!ignore) {
          setRoles(list);

          // pick default role:
          // prefer parent, otherwise first role, otherwise blank
          const hasParent = list.some((r) => r.role_name === "parent");
          const defaultRole =
            hasParent ? "parent" : (list[0]?.role_name ?? "");

          setRoleName(defaultRole);
        }
      } catch (e) {
        if (!ignore) {
          setRoles([]);
          setRoleName("");
          setMsg("Could not load roles from the API. Ensure roles are seeded in the database.");
        }
      } finally {
        if (!ignore) setLoadingRoles(false);
      }
    }

    loadRoles();
    return () => {
      ignore = true;
    };
  }, []);

  function validate() {
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!email.trim()) return "Email is required.";
    if (!password || password.length < 8) return "Password must be at least 8 characters.";
    if (!roleName) return "Role is required.";
    return "";
  }

  function redirectAfterSignup(role) {
    if (role === "parent") return navigate("/parent-dashboard");
    if (role === "student") return navigate("/student-dashboard");
    return navigate("/dashboard");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    const err = validate();
    if (err) return setMsg(err);

    setLoading(true);

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,

      // New fields (sent to backend)
      phone: phone.trim() || undefined,
      dob: dob || undefined,
      gender: gender || undefined,
      address: address.trim() || undefined,

      // Role fields
      role_name: roleName,
      role_id: selectedRole?.role_id, // optional if backend supports it
    };

    try {
      const res = await api.post("/api/v1/auth/register", payload);

      const token = res.data?.access_token;
      if (token) localStorage.setItem("imc_token", token);

      const createdRole =
        res.data?.user?.role ||
        res.data?.user?.role_name ||
        res.data?.role_name ||
        payload.role_name;

      redirectAfterSignup(createdRole);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (e?.response?.status ? `Sign up failed (HTTP ${e.response.status}).` : "Sign up failed.");
      setMsg(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">
            IslamicMasterclass
          </Link>

          <div className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">Log in</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-gray-600">
            Choose your role and create your IslamicMasterclass account.
          </p>

          {msg ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {msg}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Role dropdown */}
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                disabled={loadingRoles || roles.length === 0}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900 disabled:opacity-60"
              >
                <option value="" disabled>
                  {loadingRoles ? "Loading roles..." : "Select a role"}
                </option>
                {roles.map((r) => (
                  <option key={r.role_id ?? r.role_name} value={r.role_name}>
                    {r.role_name}
                  </option>
                ))}
              </select>

              <div className="mt-2 text-xs text-gray-500">
                {loadingRoles
                  ? "Loading roles from API…"
                  : roles.length
                    ? `Roles loaded: ${roles.map((r) => r.role_name).join(", ")}`
                    : "No roles returned from API."}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                  placeholder="Aisha"
                  autoComplete="given-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                  placeholder="Khan"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>

            {/* New fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Date of birth</label>
                <input
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  type="date"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-gray-900"
                placeholder="Street, City, State, ZIP"
              />
            </div>

            <button
              type="submit"
              disabled={loading || loadingRoles}
              className={[
                "w-full rounded-lg bg-black px-4 py-3 font-medium text-white",
                (loading || loadingRoles) ? "opacity-60 cursor-not-allowed" : "hover:opacity-90",
              ].join(" ")}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
