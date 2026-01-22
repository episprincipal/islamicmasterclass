import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Scope styling:
 * - Apple-style minimalism
 * - Islamic colors: emerald, gold, white
 * Ref: scope landing page design language.:contentReference[oaicite:1]{index=1}
 */

const COURSES = [
  {
    id: "quran-basics",
    title: "Qur’an Basics",
    category: "Qur’an",
    level: "Beginner",
    minAge: 6,
    lessons: 24,
    description: "Learn recitation basics, short surahs, and a simple daily practice plan.",
    featured: true,
  },
  {
    id: "arabic-101",
    title: "Arabic 101",
    category: "Arabic",
    level: "Beginner",
    minAge: 8,
    lessons: 18,
    description: "Start reading and understanding Arabic with simple patterns and practice.",
  },
  {
    id: "seerah-stories",
    title: "Seerah Stories",
    category: "Seerah",
    level: "All Levels",
    minAge: 7,
    lessons: 12,
    description: "Stories and lessons from the life of the Prophet ﷺ.",
  },
  {
    id: "islamic-manners",
    title: "Islamic Manners",
    category: "Adab",
    level: "Kids",
    minAge: 5,
    lessons: 10,
    description: "Practical adab for daily life—home, school, and friends.",
  },
  {
    id: "tajweed-foundations",
    title: "Tajwīd Foundations",
    category: "Qur’an",
    level: "Intermediate",
    minAge: 10,
    lessons: 16,
    description: "Makharij, rules, and guided practice with clear structure.",
  },
  {
    id: "fiqh-for-families",
    title: "Fiqh for Families",
    category: "Fiqh",
    level: "All Levels",
    minAge: 12,
    lessons: 14,
    description: "Everyday rulings explained simply with family-friendly examples.",
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Kids", "All Levels"];
const CATEGORIES = ["All", "Qur’an", "Arabic", "Seerah", "Adab", "Fiqh"];

export default function Home() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [level, setLevel] = useState("All");
  const [category, setCategory] = useState("All");

  const featured = useMemo(() => COURSES.find((c) => c.featured) || COURSES[0], []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return COURSES.filter((c) => {
      const matchesQ =
        !s ||
        (c.title + " " + c.category + " " + c.level + " " + c.description)
          .toLowerCase()
          .includes(s);

      const matchesLevel = level === "All" || c.level === level;
      const matchesCategory = category === "All" || c.category === category;

      return matchesQ && matchesLevel && matchesCategory;
    });
  }, [q, level, category]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
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
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                Spiritual tone • Clear structure
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Learn Islam with clarity, beauty, and structure.
              </h1>

              <p className="mt-3 max-w-xl text-base text-slate-600">
                Short lessons, clear learning paths, and progress tracking—built for students and families.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
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

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-700">
                {["Beginner friendly", "Kids + Adults", "Progress tracking"].map((t) => (
                  <span key={t} className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured card (emerald + gold) */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-700">Featured</div>
                  <div className="mt-2 text-lg font-semibold">This week’s popular course</div>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                  {featured.level}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-xl font-bold">{featured.title}</div>
                <p className="mt-2 text-sm text-slate-600">{featured.description}</p>

                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-slate-500">Category</div>
                    <div className="mt-1 font-semibold">{featured.category}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-slate-500">Lessons</div>
                    <div className="mt-1 font-semibold">{featured.lessons}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-slate-500">Min Age</div>
                    <div className="mt-1 font-semibold">{featured.minAge}+</div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`View details → ${featured.title}`)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  View details <span aria-hidden="true">→</span>
                </button>
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
            <p className="mt-1 text-sm text-slate-600">Airtable-style tiles with quick details and actions.</p>
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
                <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">{c.lessons} lessons</span>
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
