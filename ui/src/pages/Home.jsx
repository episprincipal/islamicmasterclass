import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

/**
 * Scope styling:
 * - Apple-style minimalism
 * - Islamic colors: emerald, gold, white
 * Ref: scope landing page design language.:contentReference[oaicite:1]{index=1}
 */

const LEVELS = ["All", "Beginner", "Intermediate", "Kids", "All Levels"];
const CATEGORIES = ["All", "Qur’an", "Arabic", "Seerah", "Adab", "Fiqh"];

export default function Home() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [level, setLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/v1/courses?limit=100&active_only=true");
        const apiCourses = response.data || [];
        setCourses(apiCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQ =
        !s ||
        (c.title + " " + c.description)
          .toLowerCase()
          .includes(s);

      const normalizeLevel = (lvl) => (lvl || "").toLowerCase().replace(/-/g, " ");
      const matchesLevel = level === "All" || normalizeLevel(c.level) === normalizeLevel(level);
      const matchesCategory = category === "All" || c.category === category;

      return matchesQ && matchesLevel && matchesCategory;
    });
  }, [q, level, category, courses]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header (white + emerald) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left"
            aria-label="IslamicMasterclass home"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600">
              <span className="text-sm font-semibold text-white">IMC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">IslamicMasterclass</div>
              <div className="text-xs text-slate-500">Learn • Practice • Grow</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <label className="sr-only" htmlFor="homeSearch">
                Search courses
              </label>
              <input
                id="homeSearch"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                className="w-[280px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </header>

      {/* Hero (white + gold accent) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex justify-center">
            <div className="max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                Spiritual tone • Clear structure
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Learn Islam with clarity, beauty, and structure.
              </h1>

              <p className="mt-3 text-base text-slate-600">
                Short lessons, clear learning paths, and progress tracking—built for students and families.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Enroll Now
                </button>

                <button
                  onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Explore Courses
                </button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-700">
                {["Beginner friendly", "Kids + Adults", "Progress tracking"].map((t) => (
                  <span key={t} className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Course Catalog</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
              <label className="sr-only" htmlFor="levelFilter">
                Level
              </label>
              <select
                id="levelFilter"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-lg bg-white px-3 py-2 text-sm outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
              <label className="sr-only" htmlFor="categoryFilter">
                Category
              </label>
              <select
                id="categoryFilter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg bg-white px-3 py-2 text-sm outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setQ("");
                setLevel("All");
                setCategory("All");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{c.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                  {c.level}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">{c.category}</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">{c.lessons} chapters</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">Min age {c.minAge}+</span>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => alert(`Learn more → ${c.title}`)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Learn More
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            No courses matched your search/filters.
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} IslamicMasterclass</div>
            <div className="flex gap-4">
              <button className="hover:text-slate-800">Privacy</button>
              <button className="hover:text-slate-800">Terms</button>
              <button className="hover:text-slate-800">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

