import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeStudents: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    // Get admin name from localStorage
    const user = localStorage.getItem("imc_user");
    if (user) {
      const userData = JSON.parse(user);
      setAdminName(userData.first_name || "Admin");
    }

    // Fetch admin stats and recent activity
    fetchAdminStats();
    fetchRecentActivity();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/v1/admin/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      setActivityLoading(true);
      const response = await api.get("/api/v1/admin/dashboard/recent-activity");
      setRecentActivity(response.data.activities || []);
    } catch (err) {
      console.error("Error fetching recent activity:", err);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("imc_token");
    localStorage.removeItem("imc_user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
              <span className="text-sm font-semibold text-white">IMC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">IslamicMasterclass</div>
              <div className="text-xs text-slate-500">Admin Portal</div>
            </div>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200 transition-all duration-200 hover:shadow-md hover:ring-emerald-300 active:scale-95"
            >
              <span className="hidden sm:inline">{adminName}</span>
              <span className="sm:hidden">Menu</span>
              <svg
                className="h-4 w-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
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

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={fetchAdminStats}
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
                Admin Dashboard
              </h1>
              <p className="mt-2 text-emerald-50">
                Manage users, courses, and platform settings
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Total Users
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.totalUsers}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Registered accounts
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Total Courses
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.totalCourses}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Active courses
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Total Enrollments
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.totalEnrollments}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Course registrations
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">
              Active Students
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.activeStudents}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Learning now
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => navigate("/admin/users")}
              className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-emerald-200"
            >
              <div className="text-base font-semibold text-slate-900">
                Manage Users
              </div>
              <p className="mt-1 text-sm text-slate-600">
                View and edit user accounts
              </p>
            </button>

            <button className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-emerald-200">
              <div className="text-base font-semibold text-slate-900">
                Manage Courses
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Create and edit courses
              </p>
            </button>

            <button className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-emerald-200">
              <div className="text-base font-semibold text-slate-900">
                View Reports
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Analytics and insights
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {activityLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-slate-600">Loading activity...</p>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  No recent activity to display
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {activity.type === "user_registered" ? (
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {activity.title}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
