import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { jwtDecode } from "jwt-decode";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-gray-100 text-gray-700 ring-gray-200",
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    gold: "bg-amber-50 text-amber-800 ring-amber-200",
    red: "bg-red-50 text-red-800 ring-red-200",
    blue: "bg-blue-50 text-blue-800 ring-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone] || tones.neutral
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
        <span>Progress</span>
        <span>{v}%</span>
      </div>
    </div>
  );
}

function quizTone(status) {
  const s = (status || "").toLowerCase();
  if (s === "passed") return "emerald";
  if (s === "failed") return "red";
  if (s === "in progress") return "blue";
  return "neutral";
}

function GlassTopBar({ parentName, onLogout, onAddChildClick }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
            <span className="text-sm font-semibold text-white">IMC</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">IslamicMasterclass</div>
            <div className="text-xs text-slate-500">Parent Portal</div>
          </div>
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200 transition-all duration-200 hover:shadow-md hover:ring-emerald-300 active:scale-95"
          >
            <span className="hidden sm:inline">{parentName}</span>
            <span className="sm:hidden">Menu</span>
            <svg
              className="h-4 w-4 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
              onMouseLeave={() => setOpen(false)}
            >
              <Link
                to="/payment"
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Payment
              </Link>
              <button
                onClick={() => {
                  onAddChildClick();
                  setOpen(false);
                }}
                className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Add Child
              </button>
              <div className="my-1 h-px bg-slate-100" />
              <button
                onClick={onLogout}
                className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function StudentTile({ student, onSelect, selected, onLoginAs }) {
  const courseCount = student.course_count || 0;
  const avgPercent = student.avg_progress || 0;

  return (
    <div
      onClick={() => onSelect(student)}
      className={cn(
        "group text-left rounded-2xl border bg-white p-5 shadow-sm transition cursor-pointer",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-300"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
            {student.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">{student.name}</div>
            <div className="mt-0.5 text-xs text-gray-600">ID {student.id}</div>
          </div>
        </div>

        <Badge tone="gold">{courseCount} Courses</Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-700">Course Progress</div>
          <div className="text-xs text-gray-600">{Math.round(avgPercent)}% Avg</div>
        </div>
        <div className="mt-2">
          <ProgressBar value={avgPercent} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-900 underline decoration-gray-200 underline-offset-4 group-hover:decoration-gray-900">
          View Details
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLoginAs(student);
          }}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          Login as {student.name.split(' ')[0]}
        </button>
      </div>
    </div>
  );
}

function CourseRow({ course }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900">{course.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{course.level}</Badge>
          </div>
        </div>

        <Badge tone={quizTone(course.quiz?.status)}>{course.quiz?.status || "Not Started"}</Badge>
      </div>

      <div className="mt-3">
        <ProgressBar value={course.progress} />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Quiz Score</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {course.quiz?.score === null || typeof course.quiz?.score === "undefined"
              ? ""
              : `${course.quiz.score}%`}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {course.quiz?.total ? `${course.quiz.correct}/${course.quiz.total}` : "No quiz"}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Status</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">{course.status || "Active"}</div>
          <div className="mt-1 text-xs text-gray-600">Enrollment</div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Enrolled</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {course.enrolled_at
              ? new Date(course.enrolled_at).toLocaleDateString()
              : ""}
          </div>
          <div className="mt-1 text-xs text-gray-600">Date</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
          View Details
        </button>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50">
          Unenroll
        </button>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [parentId, setParentId] = useState(null);
  const [parentName, setParentName] = useState("Parent");
  const [children, setChildren] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [addChildForm, setAddChildForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  });
  const [addChildLoading, setAddChildLoading] = useState(false);
  const [addChildError, setAddChildError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("imc_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setParentId(decoded.sub);
      
      const userData = localStorage.getItem("imc_user");
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log("User data:", user);
        
        // Try multiple ways to get the parent's name
        let displayName = "Parent";
        
        if (user.first_name && user.last_name) {
          displayName = `${user.first_name} ${user.last_name}`;
        } else if (user.first_name) {
          displayName = user.first_name;
        } else if (user.firstName && user.lastName) {
          displayName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          displayName = user.firstName;
        } else if (user.name) {
          displayName = user.name;
        } else if (user.email) {
          displayName = user.email.split('@')[0];
        }
        
        console.log("Display name:", displayName);
        setParentName(displayName);
      }
    } catch (err) {
      console.error("Token decode error:", err);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!parentId) return;

    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/v1/parent/children?parent_id=${parentId}`);
        setChildren(response.data);
        if (response.data.length > 0) {
          setSelectedStudent(response.data[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to load children data");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [parentId]);

  useEffect(() => {
    if (!parentId || !selectedStudent) {
      setCourses([]);
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await api.get(
          `/api/v1/parent/children/${selectedStudent.id}/courses?parent_id=${parentId}`
        );
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, [parentId, selectedStudent]);

  const stats = useMemo(() => {
    const childrenCount = children.length;
    const totalCourses = courses.length;
    const passed = courses.filter((c) => (c.quiz?.status || "").toLowerCase() === "passed").length;
    const inProgress = courses.filter(
      (c) => (c.quiz?.status || "").toLowerCase() === "in progress"
    ).length;

    return { childrenCount, totalCourses, passed, inProgress };
  }, [children, courses]);

  const handleLogout = () => {
    localStorage.removeItem("imc_token");
    localStorage.removeItem("imc_user");
    navigate("/logout");
  };

  const handleLoginAs = async (child) => {
    try {
      // Save parent's current session before switching to child
      const currentToken = localStorage.getItem("imc_token");
      const currentUser = localStorage.getItem("imc_user");
      if (currentToken && currentUser) {
        localStorage.setItem("parent_token_backup", currentToken);
        localStorage.setItem("parent_user_backup", currentUser);
      }

      const response = await api.post(`/api/v1/parent/children/${child.id}/login?parent_id=${parentId}`);
      const { access_token, user } = response.data;

      // Store the child's token and user info
      localStorage.setItem("imc_token", access_token);
      localStorage.setItem("imc_user", JSON.stringify(user));

      // Redirect to student dashboard
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Error logging in as child:", err);
      alert("Failed to login as child. Please try again.");
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setAddChildError("");

    if (!addChildForm.firstName.trim() || !addChildForm.lastName.trim() || !addChildForm.dob || !addChildForm.gender) {
      setAddChildError("Please fill in all fields");
      return;
    }

    setAddChildLoading(true);
    try {
      const response = await api.post(`/api/v1/parent/children?parent_id=${parentId}`, {
        first_name: addChildForm.firstName.trim(),
        last_name: addChildForm.lastName.trim(),
        dob: addChildForm.dob,
        gender: addChildForm.gender,
      });

      // Add the new child to the list
      const newChild = response.data;
      setChildren([...children, newChild]);
      
      // Reset form and close modal
      setAddChildForm({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
      });
      setShowAddChildModal(false);
    } catch (err) {
      const errorMsg = err?.response?.data?.detail || err?.message || "Failed to add child";
      setAddChildError(errorMsg);
    } finally {
      setAddChildLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <GlassTopBar parentName={parentName} onLogout={handleLogout} onAddChildClick={() => setShowAddChildModal(true)} />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-emerald-50 via-white to-white" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-6xl bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(245,158,11,0.10),transparent_35%)]" />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Parent Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor your children's progress and course enrollment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
              Download Report
            </button>
            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
              Messages
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Children</div>
            <div className="mt-1 text-2xl font-semibold">{stats.childrenCount}</div>
          </div>
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Total Courses</div>
            <div className="mt-1 text-2xl font-semibold">{stats.totalCourses}</div>
          </div>
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Quizzes Passed</div>
            <div className="mt-1 text-2xl font-semibold">{stats.passed}</div>
          </div>
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="mt-1 text-2xl font-semibold">{stats.inProgress}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Children</h2>
              <span className="text-sm text-gray-600">{children.length} total</span>
            </div>

            {children.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-gray-600">No children registered yet.</p>
                <button
                  onClick={() => setShowAddChildModal(true)}
                  className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Add a Child
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {children.map((s) => (
                  <StudentTile
                    key={s.id}
                    student={s}
                    selected={selectedStudent?.id === s.id}
                    onSelect={setSelectedStudent}
                    onLoginAs={handleLoginAs}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-7">
            {!selectedStudent ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                <p className="text-gray-600">Select a child to view details.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
                      {selectedStudent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-gray-900">{selectedStudent.name}</div>
                      <div className="mt-1 text-sm text-gray-600">Student ID {selectedStudent.id}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="gold">
                      {courses.length} course(s)  {Math.round(selectedStudent.avg_progress || 0)}% avg
                    </Badge>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-xs text-gray-600">Active Courses</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {courses.filter((c) => (c.status || "").toLowerCase() === "active").length}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">Enrolled</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-xs text-gray-600">Progress</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {Math.round(selectedStudent.avg_progress || 0)}%
                    </div>
                    <div className="mt-1 text-xs text-gray-600">Average</div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-xs text-gray-600">Quizzes</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {stats.passed}/{stats.totalCourses}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">Passed</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Enrolled Courses</h3>
                  <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
                    Assign Course
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                    <p className="text-gray-600">No courses enrolled yet.</p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4">
                    {courses.map((course) => (
                      <CourseRow key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-10 border-t border-slate-300 pt-6 text-sm text-gray-500">
          Real-time parent dashboard powered by Islamic Masterclass database.
        </footer>
      </main>

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900">Add Child</h2>
            <p className="mt-1 text-sm text-slate-600">Enter your child's information</p>

            {addChildError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 ring-1 ring-red-200">
                {addChildError}
              </div>
            )}

            <form onSubmit={handleAddChild} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  type="text"
                  value={addChildForm.firstName}
                  onChange={(e) => setAddChildForm({ ...addChildForm, firstName: e.target.value })}
                  placeholder="First name"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  type="text"
                  value={addChildForm.lastName}
                  onChange={(e) => setAddChildForm({ ...addChildForm, lastName: e.target.value })}
                  placeholder="Last name"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={addChildForm.dob}
                  onChange={(e) => setAddChildForm({ ...addChildForm, dob: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  value={addChildForm.gender}
                  onChange={(e) => setAddChildForm({ ...addChildForm, gender: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={addChildLoading}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                >
                  {addChildLoading ? "Adding..." : "Add Child"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}