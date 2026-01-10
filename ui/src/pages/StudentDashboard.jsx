import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">IslamicMasterclass</Link>
          <Link className="text-sm underline" to="/logout">Logout</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Dummy data for now. Later you’ll show enrolled courses + progress.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Enrolled Courses</div>
            <div className="mt-1 text-2xl font-semibold">3</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Completed Lessons</div>
            <div className="mt-1 text-2xl font-semibold">12</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Next Quiz</div>
            <div className="mt-1 text-2xl font-semibold">Surah Al-Fatiha</div>
          </div>
        </div>
      </main>
    </div>
  );
}
