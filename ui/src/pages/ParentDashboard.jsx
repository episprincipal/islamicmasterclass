import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Parent Dashboard UI (Seed Data Only)
 * Design based on scope doc: Apple-style minimal + Islamic colors (emerald/gold/white),
 * Airtable-style child cards, top bar with dropdown.
 */

const SEED_PARENT = {
  name: "Parent: Ibrahim",
  students: [
    {
      id: 1001,
      name: "Ayaan Ibrahim",
      age: 10,
      avatar: "AI",
      avgPercent: 82,
      courses: [
        {
          id: 201,
          title: "Qur’an Basics",
          level: "Beginner",
          category: "Qur’an",
          progress: 68,
          quiz: { status: "In Progress", correct: 7, total: 10, lastScore: 70 },
          timeAvgMin: 6,
          wrongAnswers: 3,
        },
        {
          id: 202,
          title: "Seerah Foundations",
          level: "Beginner",
          category: "Islamic Studies",
          progress: 92,
          quiz: { status: "Passed", correct: 9, total: 10, lastScore: 90 },
          timeAvgMin: 4,
          wrongAnswers: 1,
        },
        {
          id: 203,
          title: "Tajweed Level 1",
          level: "Beginner",
          category: "Qur’an",
          progress: 44,
          quiz: { status: "Not Started", correct: 0, total: 10, lastScore: null },
          timeAvgMin: 0,
          wrongAnswers: 0,
        },
      ],
      assessments: [
        { name: "Placement Test", date: "2025-11-10", score: 84, band: "Current" },
        { name: "Milestone Re-Assessment", date: "2025-12-22", score: 88, band: "Current" },
      ],
    },
    {
      id: 1002,
      name: "Zaynab Ibrahim",
      age: 13,
      avatar: "ZI",
      avgPercent: 74,
      courses: [
        {
          id: 204,
          title: "Qur’an Recitation",
          level: "Intermediate",
          category: "Qur’an",
          progress: 58,
          quiz: { status: "Failed", correct: 5, total: 10, lastScore: 50 },
          timeAvgMin: 8,
          wrongAnswers: 5,
        },
        {
          id: 205,
          title: "Fiqh Essentials",
          level: "Intermediate",
          category: "Islamic Studies",
          progress: 79,
          quiz: { status: "Passed", correct: 8, total: 10, lastScore: 80 },
          timeAvgMin: 5,
          wrongAnswers: 2,
        },
      ],
      assessments: [{ name: "Placement Test", date: "2025-10-28", score: 72, band: "Current" }],
    },
    {
      id: 1003,
      name: "Yusuf Ibrahim",
      age: 7,
      avatar: "YI",
      avgPercent: 90,
      courses: [
        {
          id: 206,
          title: "Arabic Letters",
          level: "Beginner",
          category: "Arabic",
          progress: 96,
          quiz: { status: "Passed", correct: 10, total: 10, lastScore: 100 },
          timeAvgMin: 3,
          wrongAnswers: 0,
        },
      ],
      assessments: [{ name: "Placement Test", date: "2025-12-01", score: 93, band: "Advanced" }],
    },
  ],
};

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

function GlassTopBar({ parentName }) {
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
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <span className="hidden sm:inline">{parentName}</span>
            <span className="sm:hidden">Menu</span>
            <span className="text-slate-400">▾</span>
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
              <Link
                to="/logout"
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function StudentTile({ student, onSelect, selected }) {
  const courseCount = student.courses.length;

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
            {student.avatar}
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">{student.name}</div>
            <div className="mt-0.5 text-xs text-gray-600">
              Age {student.age} • ID {student.id}
            </div>
          </div>
        </div>

        <Badge tone="gold">{courseCount} Courses</Badge>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-700">Course summary</div>
          <div className="text-xs text-gray-600">{student.avgPercent}% Avg</div>
        </div>
        <div className="mt-2">
          <ProgressBar value={student.avgPercent} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 underline decoration-gray-200 underline-offset-4 group-hover:decoration-gray-900">
          Select Courses
        </span>
        <span className="text-xs text-gray-500">View report →</span>
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
            <Badge tone="neutral">{course.category}</Badge>
            <Badge tone="neutral">{course.level}</Badge>
          </div>
        </div>

        <Badge tone={quizTone(course.quiz?.status)}>{course.quiz?.status || "Unknown"}</Badge>
      </div>

      <div className="mt-3">
        <ProgressBar value={course.progress} />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Quiz</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {course.quiz?.lastScore === null || typeof course.quiz?.lastScore === "undefined"
              ? "—"
              : `${course.quiz.lastScore}%`}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {course.quiz?.total ? `${course.quiz.correct}/${course.quiz.total} correct` : "No quiz"}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Wrong answers</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">{course.wrongAnswers}</div>
          <div className="mt-1 text-xs text-gray-600">Last attempts</div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-slate-200">
          <div className="text-xs text-gray-600">Avg time</div>
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {course.timeAvgMin ? `${course.timeAvgMin} min` : "—"}
          </div>
          <div className="mt-1 text-xs text-gray-600">Per quiz</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
          Assign Course
        </button>
        <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50">
          View Report
        </button>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const parent = SEED_PARENT;
  const [selectedStudent, setSelectedStudent] = useState(parent.students[0]);

  const stats = useMemo(() => {
    const children = parent.students.length;
    const totalCourses = parent.students.reduce((sum, s) => sum + s.courses.length, 0);

    const quizzes = parent.students.flatMap((s) => s.courses.map((c) => c.quiz));
    const passed = quizzes.filter((q) => (q?.status || "").toLowerCase() === "passed").length;
    const inProgress = quizzes.filter((q) => (q?.status || "").toLowerCase() === "in progress")
      .length;

    return { children, totalCourses, passed, inProgress };
  }, [parent.students]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <GlassTopBar parentName={parent.name} />

      {/* subtle Islamic minimal background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-emerald-50 via-white to-white" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-6xl bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(245,158,11,0.10),transparent_35%)]" />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Parent Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Airtable-style child cards with course and quiz insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
              Download Report
            </button>
            <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
              Messages
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Children</div>
            <div className="mt-1 text-2xl font-semibold">{stats.children}</div>
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

        {/* Main grid: Child Cards + Details */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Left: child tiles */}
          <section className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Children</h2>
              <span className="text-sm text-gray-600">{parent.students.length} total</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {parent.students.map((s, index) => (
                <StudentTile
                  key={s.id}
                  student={s}
                  selected={selectedStudent?.id === s.id}
                  onSelect={setSelectedStudent}
                />
              ))}
            </div>
          </section>

          {/* Right: child details view */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
                    {selectedStudent.avatar}
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-gray-900">{selectedStudent.name}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      Age {selectedStudent.age} • Student ID {selectedStudent.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="gold">
                    {selectedStudent.courses.length} course(s) • {selectedStudent.avgPercent}% avg
                  </Badge>
                  <Badge tone="emerald">
                    {selectedStudent.assessments?.[0]?.band || "Placement"} level
                  </Badge>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-600">Wrong answers</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedStudent.courses.reduce((sum, c) => sum + (c.wrongAnswers || 0), 0)}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">Across courses</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-600">Avg quiz time</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {Math.round(
                      selectedStudent.courses.reduce((sum, c) => sum + (c.timeAvgMin || 0), 0) /
                        Math.max(1, selectedStudent.courses.length)
                    )}{" "}
                    min
                  </div>
                  <div className="mt-1 text-xs text-gray-600">Per course</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-xs text-gray-600">Assessment history</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {selectedStudent.assessments.length}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">Records</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <h3 className="text-base font-semibold">Enrolled Courses</h3>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
                    Bypass Assessment
                  </button>
                  <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
                    Assign Course
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                {selectedStudent.courses.map((course, index) => (
                  <CourseRow key={course.id} course={course} />
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-base font-semibold">Assessment History</h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-300">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Assessment</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Band</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {selectedStudent.assessments.map((a, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                          <td className="px-4 py-3 text-gray-700">{a.date}</td>
                          <td className="px-4 py-3 text-gray-700">{a.score}%</td>
                          <td className="px-4 py-3">
                            <Badge tone={a.band === "Advanced" ? "emerald" : "neutral"}>{a.band}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Next step (later): Add charts (accuracy %, avg time, progress line) as described in
                  scope.
                </p>
              </div>
            </div>
          </section>           
        </div>

        <footer className="mt-10 border-t border-slate-300 pt-6 text-sm text-gray-500">
          Minimal, Islamic-themed, Apple-style dashboard UI with Airtable child tiles (seed data).
        </footer>
      </main>
    </div>
  );
}
