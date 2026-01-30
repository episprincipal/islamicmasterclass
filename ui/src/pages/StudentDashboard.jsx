import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";

/**
 * Student Dashboard
 * - Apple-style minimalism with emerald/gold accents
 * - Progress tracking, enrolled courses, upcoming lessons
 */

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  
  // Real data from API
  const [studentStats, setStudentStats] = useState({
    enrolledCourses: 0,
    averageProgress: 0,
    completedCourses: 0,
    inProgressCourses: 0,
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingChapters, setUpcomingChapters] = useState([]);

  useEffect(() => {
    fetchStudentData();
    
    // Get student name from localStorage
    const user = localStorage.getItem("imc_user");
    if (user) {
      const userData = JSON.parse(user);
      setStudentName(userData.first_name || "Student");
    }
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get student ID from JWT token
      const token = localStorage.getItem("imc_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decoded = jwtDecode(token);
      const studentId = decoded.sub; // user_id from JWT

      // Fetch all student data in parallel
      const [statsRes, coursesRes, chaptersRes] = await Promise.all([
        api.get(`/api/v1/student/dashboard?student_id=${studentId}`),
        api.get(`/api/v1/student/courses?student_id=${studentId}`),
        api.get(`/api/v1/student/chapters/upcoming?student_id=${studentId}`),
      ]);

      setStudentStats(statsRes.data);
      setEnrolledCourses(coursesRes.data);
      setUpcomingChapters(chaptersRes.data);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("imc_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBackToParent = () => {
    // Restore parent's session
    const parentToken = localStorage.getItem("parent_token_backup");
    const parentUser = localStorage.getItem("parent_user_backup");

    if (parentToken && parentUser) {
      localStorage.setItem("imc_token", parentToken);
      localStorage.setItem("imc_user", parentUser);
      localStorage.removeItem("parent_token_backup");
      localStorage.removeItem("parent_user_backup");
      navigate("/parent-dashboard");
    } else {
      // Fallback if backup not found
      navigate("/login");
    }
  };

  const hasParentSession = localStorage.getItem("parent_token_backup") !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
              <span className="text-sm font-semibold text-white">IMC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">IslamicMasterclass</div>
              <div className="text-xs text-slate-500">Student Portal</div>
            </div>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200 transition-all duration-200 hover:shadow-md hover:ring-emerald-300 active:scale-95"
            >
              <span className="hidden sm:inline">{studentName}</span>
              <span className="sm:hidden">Menu</span>
              <svg
                className="h-4 w-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {!hasParentSession && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/courses");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Browse Courses
                    </button>
                    <button
                      onClick={() => {
                        // Edit Profile will be connected later
                        setMenuOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Edit Profile
                    </button>
                    <div className="my-1 h-px bg-slate-100" />
                  </>
                )}
                {hasParentSession && (
                  <>
                    <button
                      onClick={() => {
                        handleBackToParent();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 font-medium"
                    >
                      ← Back to Parent
                    </button>
                    <div className="my-1 h-px bg-slate-100" />
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={fetchStudentData}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Welcome Section */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white shadow-sm md:p-8">
              <h1 className="text-2xl font-bold md:text-3xl">
                As-salamu alaykum! 👋
              </h1>
              <p className="mt-2 text-emerald-50">
                {studentStats.enrolledCourses > 0 
                  ? "Welcome back to your learning journey. Keep up the great work!"
                  : "Welcome to your learning journey! Start by enrolling in your first course."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-medium text-slate-600">
                  Enrolled Courses
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-600">
                  {studentStats.enrolledCourses}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Active enrollments
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-medium text-slate-600">
                  Average Progress
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-600">
                  {Math.round(studentStats.averageProgress)}%
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Across all courses
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-medium text-slate-600">
                  Completed Courses
                </div>
                <div className="mt-2 text-3xl font-bold text-amber-600">
                  {studentStats.completedCourses}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {studentStats.inProgressCourses} in progress
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 flex gap-2 border-b border-slate-200">
              {["overview", "courses"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-t-xl px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "border-b-2 border-emerald-600 text-emerald-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Upcoming Chapters */}
                  <div>
                    <h2 className="text-xl font-bold">Upcoming Chapters</h2>
                    {upcomingChapters.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {upcomingChapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-2xl">
                                📖
                              </div>
                              <div>
                                <div className="text-sm font-semibold">
                                  {chapter.title}
                                </div>
                                <div className="text-xs text-slate-600">
                                  {chapter.course}
                                </div>
                              </div>
                            </div>
                            <button className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500">
                              Start
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-6 text-center text-slate-600 ring-1 ring-slate-200">
                        <p>No upcoming chapters at the moment.</p>
                        <p className="mt-2 text-sm">
                          Browse courses to get started!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Continue Learning */}
                  <div>
                    <h2 className="text-xl font-bold">Continue Learning</h2>
                    {enrolledCourses.length > 0 ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {enrolledCourses.slice(0, 3).map((course) => (
                          <div
                            key={course.id}
                            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="text-base font-semibold">
                                {course.title}
                              </h3>
                              {course.level && (
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                                  {course.level}
                                </span>
                              )}
                            </div>
                            {course.description && (
                              <div className="mt-2 text-sm text-slate-600">
                                {course.description.substring(0, 80)}
                                {course.description.length > 80 ? "..." : ""}
                              </div>
                            )}
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>Progress</span>
                                <span className="font-semibold">
                                  {Math.round(course.progress)}%
                                </span>
                              </div>
                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-emerald-600"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            <button className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                              Continue
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-6 text-center text-slate-600 ring-1 ring-slate-200">
                        <p>You haven't enrolled in any courses yet.</p>
                        <button
                          onClick={() => navigate("/courses")}
                          className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                        >
                          Browse Courses
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">My Courses</h2>
                    <button
                      onClick={() => navigate("/courses")}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                    >
                      Browse More
                    </button>
                  </div>
                  {enrolledCourses.length > 0 ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                        >
                          <div className="flex items-start justify-between">
                            <h3 className="text-base font-semibold">
                              {course.title}
                            </h3>
                            {course.level && (
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                                {course.level}
                              </span>
                            )}
                          </div>
                          {course.description && (
                            <div className="mt-2 text-sm text-slate-600">
                              {course.description.substring(0, 100)}
                              {course.description.length > 100 ? "..." : ""}
                            </div>
                          )}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>Progress</span>
                              <span className="font-semibold">
                                {Math.round(course.progress)}%
                              </span>
                            </div>
                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-emerald-600"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                          <button className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                            Continue
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-6 text-center text-slate-600 ring-1 ring-slate-200">
                      <p>You haven't enrolled in any courses yet.</p>
                      <button
                        onClick={() => navigate("/courses")}
                        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                      >
                        Browse Courses
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} IslamicMasterclass</div>
            <div className="flex gap-4">
              <button className="hover:text-slate-800">Help Center</button>
              <button className="hover:text-slate-800">Settings</button>
              <button className="hover:text-slate-800">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
