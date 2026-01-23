import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token) {
      localStorage.setItem("imc_token", token);
      
      // Redirect based on role
      if (role === "parent") {
        navigate("/parent-dashboard");
      } else if (role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-lg font-semibold">Completing sign in...</div>
        <div className="mt-2 text-sm text-slate-600">Please wait</div>
      </div>
    </div>
  );
}
