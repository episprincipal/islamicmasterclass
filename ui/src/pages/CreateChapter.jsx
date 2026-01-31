import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function CreateChapter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  // Get course_id from query param if present
  const params = new URLSearchParams(location.search);
  const initialCourseId = params.get("course_id") || "";
  const [form, setForm] = useState({
    course_id: initialCourseId,
    title: "",
    chapter_order: 1,
  });
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/v1/courses?limit=100").then((res) => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (form.course_id) {
      api.get(`/api/v1/chapters/course/${form.course_id}`)
        .then((res) => setChapters(res.data))
        .catch(() => setChapters([]));
    } else {
      setChapters([]);
    }
  }, [form.course_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/api/v1/chapters/", {
        course_id: Number(form.course_id),
        title: form.title,
        chapter_order: Number(form.chapter_order),
      });
      setMessage("Chapter created successfully.");
      setForm({ ...form, title: "", chapter_order: 1 });
      // Refresh chapter list
      const res = await api.get(`/api/v1/chapters/course/${form.course_id}`);
      setChapters(res.data);
    } catch (err) {
      setMessage("Failed to create chapter.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Chapter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Course</label>
          <select
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            disabled={!!initialCourseId}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id || c.course_id} value={c.id || c.course_id}>
                {c.title || c.course_name}
              </option>
            ))}
          </select>
          {initialCourseId && (
            <div className="text-xs text-emerald-700 mt-1">Course pre-selected from previous step.</div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Chapter Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Chapter Order</label>
          <input
            type="number"
            name="chapter_order"
            value={form.chapter_order}
            min={1}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Chapter"}
        </button>
        <button
          type="button"
          className="ml-2 bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
          onClick={() => navigate("/admin/manage-courses")}
        >
          Back to Courses
        </button>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
      {chapters.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Chapters in Course</h3>
          <ul className="list-disc pl-5">
            {chapters.map((ch) => (
              <li key={ch.chapter_id}>
                {ch.chapter_order}. {ch.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
