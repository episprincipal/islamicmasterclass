import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoryMode, setCategoryMode] = useState("existing");
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "all-levels",
    price: "",
    min_age: "",
    age_max: "",
    is_active: true,
  });

  const levels = [
    { value: "all-levels", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  // Fetch existing categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/v1/courses", {
          params: { limit: 200 }
        });
        const courses = Array.isArray(response.data) ? response.data : [];
        
        // Extract unique categories
        const uniqueCategories = [...new Set(
          courses
            .map(c => c.category)
            .filter(cat => cat && cat.trim())
        )].sort();
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Fallback to default categories if fetch fails
        setCategories(["Fiqh", "Tajweed", "Adab", "Seerah", "Arabic", "Quran"]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const nextErrors = {};
    if (!formData.title.trim()) nextErrors.title = "Course title is required.";
    if (categoryMode === "custom") {
      if (!newCategory.trim()) nextErrors.category = "New category is required.";
    } else if (!formData.category.trim()) {
      nextErrors.category = "Category is required.";
    }
    if (!formData.level) nextErrors.level = "Level is required.";
    if (formData.price === "") nextErrors.price = "Price is required.";
    if (formData.min_age === "") nextErrors.min_age = "Minimum age is required.";
    if (formData.age_max === "") nextErrors.age_max = "Maximum age is required.";

    const minAge = formData.min_age === "" ? null : parseInt(formData.min_age);
    const maxAge = formData.age_max === "" ? null : parseInt(formData.age_max);
    if (minAge !== null && maxAge !== null && minAge > maxAge) {
      nextErrors.age_max = "Maximum age must be greater than or equal to minimum age.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please fix the highlighted fields.");
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API - use backend field names
      const courseData = {
        course_name: formData.title,  // Backend expects 'course_name'
        description: formData.description,
        category: categoryMode === "custom" ? newCategory.trim() : formData.category,
        level: formData.level,
        price: parseFloat(formData.price),
        min_age: parseInt(formData.min_age),
        age_max: parseInt(formData.age_max),
        is_active: formData.is_active,
      };

      await api.post("/api/v1/courses", courseData);
      alert("Course created successfully!");
      navigate("/admin/manage-courses");
    } catch (err) {
      console.error("Error creating course:", err);
      let errorMessage = "Failed to create course. Please try again.";
      
      if (err.response?.data) {
        const data = err.response.data;
        // Handle different error formats
        if (data.detail) {
          errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        } else if (Array.isArray(data)) {
          // Handle Pydantic validation errors
          errorMessage = data.map(e => e.msg || e.detail || JSON.stringify(e)).join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="text-xs text-slate-500">Create Course</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/manage-courses")}
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
          >
            ← Back to Courses
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Course</h1>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-900 ring-1 ring-red-200">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Islamic Manners for Kids"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.title ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the course"
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={categoryMode === "custom" ? "__custom__" : formData.category}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setCategoryMode("custom");
                    setFormData((prev) => ({ ...prev, category: "" }));
                  } else {
                    setCategoryMode("existing");
                    setFormData((prev) => ({ ...prev, category: e.target.value }));
                  }
                }}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.category ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">Add new category...</option>
              </select>
              {categoryMode === "custom" && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.category ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
                  />
                </div>
              )}
              {fieldErrors.category && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.level ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {fieldErrors.level && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.level}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.price ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
              />
              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>
              )}
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Minimum Age
                </label>
                <input
                  type="number"
                  name="min_age"
                  value={formData.min_age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                  placeholder="e.g., 5"
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.min_age ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
                />
                {fieldErrors.min_age && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.min_age}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Maximum Age
                </label>
                <input
                  type="number"
                  name="age_max"
                  value={formData.age_max}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                  placeholder="e.g., 12"
                  className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${fieldErrors.age_max ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"}`}
                />
                {fieldErrors.age_max && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.age_max}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                Active Course
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-courses")}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
