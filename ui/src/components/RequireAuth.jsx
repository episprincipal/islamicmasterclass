import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function RequireAuth() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
