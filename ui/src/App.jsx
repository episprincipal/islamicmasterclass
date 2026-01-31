import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageCourses from "./pages/ManageCourses";
import CreateCourse from "./pages/CreateCourse";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/Logout";

import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

export default function App ()
{
  return (
    <Routes>
      {/* Public */ }
      <Route path="/" element={ <Home /> } />
      <Route path="/login" element={ <Login /> } />
      <Route path="/signup" element={ <Signup /> } />
      <Route path="/auth/callback" element={ <AuthCallback /> } />

      <Route path="/unauthorized" element={ <Unauthorized /> } />
      <Route path="/logout" element={ <Logout /> } />

      {/* Protected */ }
      <Route element={ <RequireAuth /> }>
        <Route element={ <RequireRole allowed={ [ "admin" ] } /> }>
          <Route path="/admin-dashboard" element={ <AdminDashboard /> } />
          <Route path="/admin/users" element={ <ManageUsers /> } />
          <Route path="/admin/manage-courses" element={ <ManageCourses /> } />
          <Route path="/admin/create-course" element={ <CreateCourse /> } />
        </Route>

        <Route element={ <RequireRole allowed={ [ "parent" ] } /> }>
          <Route path="/parent-dashboard" element={ <ParentDashboard /> } />
        </Route>

        <Route element={ <RequireRole allowed={ [ "student" ] } /> }>
          <Route path="/student-dashboard" element={ <StudentDashboard /> } />
        </Route>
      </Route>

      {/* Fallback */ }
      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
  );
}
