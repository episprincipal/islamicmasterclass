import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center">
      <div className="mx-auto max-w-lg px-6">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission to view that page.
        </p>
        <Link to="/" className="mt-4 inline-block underline">Go home</Link>
      </div>
    </div>
  );
}
