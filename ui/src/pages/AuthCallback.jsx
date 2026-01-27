import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const firstName = searchParams.get("first_name");
    const lastName = searchParams.get("last_name");
    const email = searchParams.get("email");

    if (token) {
      localStorage.setItem("imc_token", token);
      
      // Store user data if available
      if (email) {
        const userData = {
          email,
          role,
          first_name: firstName || '',
          last_name: lastName || ''
        };
        localStorage.setItem("imc_user", JSON.stringify(userData));
      }
      
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
