import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../lib/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    clearToken();               // remove JWT token
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // nothing to render
}
