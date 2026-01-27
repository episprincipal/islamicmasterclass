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

function GlassTopBar({ parentName, onLogout }) {
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
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <span className="hidden sm:inline">{parentName}</span>
            <span className="sm:hidden">Menu</span>
            <span className="text-slate-400"></span>
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
              <Link
                to="/add-child"
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Add Child
              </Link>
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

function StudentTile({ student, onSelect, selected }) {
  const courseCount = student.course_count || 0;
  const avgPercent = student.avg_progress || 0;

  return (
    <button
      onClick={() => onSelect(student)}
      className={cn(
        "group text-left rounded-2xl border bg-white p-5 shadow-sm transition",
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

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 underline decoration-gray-200 underline-offset-4 group-hover:decoration-gray-900">
          View Details
        </span>
        <span className="text-xs text-gray-500"></span>
      </div>
    </button>
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
      <GlassTopBar parentName={parentName} onLogout={handleLogout} />

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
                <Link
                  to="/add-child"
                  className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Add a Child
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {children.map((s) => (
                  <StudentTile
                    key={s.id}
                    student={s}
                    selected={selectedStudent?.id === s.id}
                    onSelect={setSelectedStudent}
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
    </div>
  );
}