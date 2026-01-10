import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken, getToken } from "../lib/auth";

export default function RequireRole({ allowed = [] }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  const role = getRoleFromToken();
  const ok = allowed.map((r) => r.toLowerCase()).includes(role);

  return ok ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
