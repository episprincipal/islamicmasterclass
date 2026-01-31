import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from "recharts";

export default function ManageCourses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    categories: {},
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [search, currentPage, pageSize]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (currentPage - 1) * pageSize;
      const response = await api.get("/api/v1/courses", {
        params: {
          search: search || undefined,
          limit: pageSize,
          offset,
        },
      });
      
      // The API returns an array directly or wrapped in a 'value' key
      const coursesData = Array.isArray(response.data) ? response.data : (response.data.value || response.data.courses || []);
      setCourses(coursesData);
      
      // Get total count
      const countResponse = await api.get("/api/v1/courses", {
        params: {
          limit: 200,
          offset: 0,
        },
      });
      const allCourses = Array.isArray(countResponse.data) ? countResponse.data : (countResponse.data.value || []);
      setTotal(allCourses.length);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/v1/courses", {
        params: {
          limit: 200,  // API max limit is 200
          offset: 0,
        },
      });
      
      // The API returns an array directly or wrapped in a 'value' key
      const allCourses = Array.isArray(response.data) ? response.data : (response.data.value || response.data.courses || []);
      const active = allCourses.filter(c => c.is_active).length;
      
      const categories = {};
      allCourses.forEach(course => {
        const cat = course.category || "Uncategorized";
        categories[cat] = (categories[cat] || 0) + 1;
      });
      
      setStats({
        total: allCourses.length,
        active: active,
        categories: categories,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setViewModalOpen(true);
  };

  const handleCreateCourse = () => {
    navigate("/admin/create-course");
  };

  const handleEditCourse = (course) => {
    navigate(`/admin/edit-course/${course.id}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/api/v1/courses/${courseId}`);
      alert("Course deleted successfully");
      fetchCourses();
      fetchStats();
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  const handleToggleActive = async (courseId, currentStatus) => {
    try {
      await api.put(`/api/v1/courses/${courseId}`, {
        is_active: !currentStatus,
      });
      fetchCourses();
      fetchStats();
    } catch (err) {
      console.error("Error toggling course status:", err);
      alert("Failed to update course status");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get("/api/v1/courses", {
        params: {
          limit: 200,  // API max limit is 200
          offset: 0,
        },
      });

      // The API returns an array directly or wrapped in a 'value' key
      const coursesData = Array.isArray(response.data) ? response.data : (response.data.value || response.data.courses || []);

      if (coursesData.length === 0) {
        alert("No courses to export");
        return;
      }

      const headers = [
        "Course ID",
        "Course Name",
        "Description",
        "Category",
        "Level",
        "Price",
        "Status",
        "Created At",
      ];

      const csvRows = [
        headers.join(","),
        ...coursesData.map((course) =>
          [
            course.id,
            `"${course.title || ""}"`,
            `"${(course.description || "").replace(/"/g, '""')}"`,
            `"${course.category || ""}"`,
            `"${course.level || ""}"`,
            course.price || "0",
            course.is_active ? "Active" : "Inactive",
            `"${formatDate(course.created_at)}"`,
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `courses_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      alert("Failed to export courses");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
              <span className="text-sm font-semibold text-white">IMC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">IslamicMasterclass</div>
              <div className="text-xs text-slate-500">Manage Courses</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">Total Courses</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.total}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-600">Active Courses</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.active}
            </div>
          </div>
        </div>

        {/* By Category Bar Chart */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm font-medium text-slate-600 mb-4">By Category</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart 
              data={Object.entries(stats.categories).map(([name, value]) => ({
                name,
                count: value
              }))}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" type="category" stroke="#64748b" height={25} interval={0} />
              <YAxis type="number" stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#f8fafc", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
                cursor={{ fill: "#f1f5f9" }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} label={{ position: 'outside', fill: '#1f2937', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>

          <button 
            onClick={handleCreateCourse}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            + Create Course
          </button>

          <button 
            onClick={handleExportCSV}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading courses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Courses Table */}
        {!loading && !error && (
          <>
            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Course Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center">
                          <p className="text-sm text-slate-600">No courses found</p>
                        </td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewCourse(course)}
                              className="text-sm font-medium text-emerald-600 hover:underline"
                            >
                              {course.title}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {course.category || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">
                              {course.level || "All"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {course.price ? `$${Number(course.price).toFixed(2)}` : "Free"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleToggleActive(course.id, course.is_active)
                              }
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                course.is_active
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {course.is_active ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formatDate(course.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, total)} of {total} courses
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                              currentPage === page
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* View Course Modal */}
      {viewModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900">
              {selectedCourse.title}
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">Description</p>
                <p className="mt-1 text-slate-600">{selectedCourse.description || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-slate-900">Category</p>
                  <p className="mt-1 text-slate-600">{selectedCourse.category || "—"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Level</p>
                  <p className="mt-1 text-slate-600">{selectedCourse.level || "All"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Price</p>
                  <p className="mt-1 text-slate-600">
                    {selectedCourse.price ? `$${Number(selectedCourse.price).toFixed(2)}` : "Free"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="mt-1 text-slate-600">
                    {selectedCourse.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleEditCourse(selectedCourse)}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Edit Course
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
