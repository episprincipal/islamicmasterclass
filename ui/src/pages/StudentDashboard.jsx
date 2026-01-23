import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Student Dashboard
 * - Apple-style minimalism with emerald/gold accents
 * - Progress tracking, enrolled courses, upcoming lessons
 */

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with API calls later
  const studentStats = {
    enrolledCourses: 3,
    completedLessons: 12,
    totalLessons: 45,
    upcomingQuiz: "Surah Al-Fatiha",
    weeklyGoal: 5,
    weeklyProgress: 3,
    currentStreak: 7,
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Qur'an Basics",
      progress: 65,
      nextLesson: "Lesson 4: Tajweed Rules",
      category: "Qur'an",
    },
    {
      id: 2,
      title: "Arabic 101",
      progress: 40,
      nextLesson: "Lesson 3: Basic Grammar",
      category: "Arabic",
    },
    {
      id: 3,
      title: "Seerah Stories",
      progress: 80,
      nextLesson: "Lesson 9: The Farewell Sermon",
      category: "Seerah",
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      course: "Qur'an Basics",
      title: "Tajweed Rules Part 1",
      dueDate: "Tomorrow",
      duration: "15 min",
    },
    {
      id: 2,
      course: "Arabic 101",
      title: "Verb Conjugation",
      dueDate: "Jan 24",
      duration: "20 min",
    },
  ];

  const achievements = [
    { id: 1, title: "7 Day Streak", icon: "🔥", earned: true },
    { id: 2, title: "Quiz Master", icon: "🎯", earned: true },
    { id: 3, title: "Early Bird", icon: "🌅", earned: false },
    { id: 4, title: "Course Complete", icon: "🏆", earned: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem("imc_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/courses")}
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:block"
            >
              Browse Courses
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white shadow-sm md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">
            As-salamu alaykum! 👋
          </h1>
          <p className="mt-2 text-emerald-50">
            Welcome back to your learning journey. Keep up the great work!
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 backdrop-blur">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-xs text-emerald-50">Streak</div>
                <div className="text-lg font-semibold">
                  {studentStats.currentStreak} days
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 backdrop-blur">
              <span className="text-2xl">📚</span>
              <div>
                <div className="text-xs text-emerald-50">Weekly Goal</div>
                <div className="text-lg font-semibold">
                  {studentStats.weeklyProgress}/{studentStats.weeklyGoal} lessons
                </div>
              </div>
            </div>
          </div>
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
              {studentStats.totalLessons} total lessons
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Lessons Completed
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {studentStats.completedLessons}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {Math.round(
                (studentStats.completedLessons / studentStats.totalLessons) * 100
              )}
              % progress overall
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Upcoming Quiz
            </div>
            <div className="mt-2 text-lg font-bold text-amber-600">
              {studentStats.upcomingQuiz}
            </div>
            <div className="mt-1 text-xs text-slate-500">Tomorrow at 10 AM</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-slate-200">
          {["overview", "courses", "achievements"].map((tab) => (
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
              {/* Upcoming Lessons */}
              <div>
                <h2 className="text-xl font-bold">Upcoming Lessons</h2>
                <div className="mt-4 space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-2xl">
                          📖
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-slate-600">
                            {lesson.course} • {lesson.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-600">
                          {lesson.dueDate}
                        </div>
                        <button className="mt-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500">
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Learning */}
              <div>
                <h2 className="text-xl font-bold">Continue Learning</h2>
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
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                          {course.category}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-slate-600">
                        {course.nextLesson}
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>Progress</span>
                          <span className="font-semibold">{course.progress}%</span>
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
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                  >
                    <h3 className="text-base font-semibold">{course.title}</h3>
                    <div className="mt-2 text-sm text-slate-600">
                      {course.nextLesson}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Progress</span>
                        <span className="font-semibold">{course.progress}%</span>
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
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <h2 className="text-xl font-bold">Your Achievements</h2>
              <p className="mt-2 text-sm text-slate-600">
                Earn badges by completing lessons and maintaining streaks!
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl p-6 text-center shadow-sm ring-1 ${
                      achievement.earned
                        ? "bg-white ring-slate-200"
                        : "bg-slate-50 ring-slate-100"
                    }`}
                  >
                    <div
                      className={`text-5xl ${
                        achievement.earned ? "" : "opacity-30 grayscale"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div
                      className={`mt-3 text-sm font-semibold ${
                        achievement.earned ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {achievement.title}
                    </div>
                    {!achievement.earned && (
                      <div className="mt-1 text-xs text-slate-400">
                        Keep learning to unlock!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
