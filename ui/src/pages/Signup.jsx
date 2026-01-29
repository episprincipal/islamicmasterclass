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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("parent");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validatePhone = (phoneNum) => {
    // Accept common phone formats
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneNum === "" || phoneRegex.test(phoneNum.trim());
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateStudentAge = (dobString) => {
    const age = calculateAge(dobString);
    return age === null || age >= 13;
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Limit to 10 digits
    const truncated = cleaned.slice(0, 10);
    // Format as (XXX) XXX XXXX
    if (truncated.length === 0) return "";
    if (truncated.length <= 3) return `(${truncated}`;
    if (truncated.length <= 6) return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) strength++;
    return strength;
  };

  const validatePassword = (pwd) => {
    return pwd.length >= 6 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
  };

  const getStrengthLabel = (strength) => {
    if (strength === 0) return "None";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-slate-300";
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const newErrors = {};

    // Validate phone
    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Phone format is invalid. Use at least 10 digits.";
    }

    // Validate student age requirement
    if (role === "student") {
      if (!dob) {
        newErrors.dob = "Date of birth is required for student registration.";
      } else if (!validateStudentAge(dob)) {
        const age = calculateAge(dob);
        newErrors.dob = `Students must be at least 13 years old. You are currently ${age} years old.`;
      }
    }

    // Validate password
    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters with a special character.";
    }

    if (password !== confirm) {
      newErrors.confirm = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/register", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email,
        password,
        role_name: role,
        phone: phone.trim() || null,
        dob: dob || null,
        gender: gender || null,
        address: address.trim() || null,
      });
      const token = res.data?.access_token;
      const user = res.data?.user;
      
      if (token) localStorage.setItem("imc_token", token);
      if (user) localStorage.setItem("imc_user", JSON.stringify(user));
      
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
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

            <div className="mt-6 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-base">⚠️</span>
                <div>
                  <p className="font-semibold text-blue-900">Age Requirement for Students</p>
                  <p className="mt-1 text-sm text-blue-800">
                    Student accounts require you to be at least <span className="font-bold">13 years old</span>. A parent account is needed for students under 13 years of age.
                  </p>
                  <p className="mt-2 text-sm text-blue-800">
                    Parents can add children under 13 using the parent dashboard.
                  </p>
                </div>
              </div>
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
                <label className="text-sm font-medium text-slate-700">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
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
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="(555) 123 4567"
                  className={`mt-1 w-full rounded-xl border ${errors.phone ? 'border-red-400' : 'border-slate-200'} bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`mt-1 w-full rounded-xl border ${errors.dob ? 'border-red-400' : 'border-slate-200'} bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`}
                />
                {role === "student" && (
                  <p className="mt-1.5 text-xs text-slate-600">
                    📋 <span className="font-semibold">Students must be at least 13 years old to register.</span>
                  </p>
                )}
                {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
                {role === "student" && dob && calculateAge(dob) >= 13 && !errors.dob && (
                  <p className="mt-1 text-xs text-emerald-600">✓ Age requirement met ({calculateAge(dob)} years old)</p>
                )}
                {role === "student" && dob && calculateAge(dob) < 13 && (
                  <p className="mt-1 text-xs text-red-600">✗ Must be 13 or older ({calculateAge(dob)} years old - too young)</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city, state, zip"
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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
                  className={`mt-1 w-full rounded-xl border ${errors.password ? 'border-red-400' : 'border-slate-200'} bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`}
                  required
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                
                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">Strength:</span>
                      <span className={`text-xs font-semibold ${
                        getPasswordStrength(password) <= 2 ? 'text-red-600' :
                        getPasswordStrength(password) <= 3 ? 'text-yellow-600' :
                        getPasswordStrength(password) <= 4 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {getStrengthLabel(getPasswordStrength(password))}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor(getPasswordStrength(password))}`}
                        style={{ width: `${(getPasswordStrength(password) / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      • At least 6 characters {password.length >= 6 ? '✓' : ''}
                      <br />
                      • Contains a special character (!@#$%^&* etc) {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : ''}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className={`mt-1 w-full rounded-xl border ${errors.confirm ? 'border-red-400' : 'border-slate-200'} bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`}
                  required
                />
                {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
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
