import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ParentDashboard from "./pages/ParentDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/Logout";

import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/logout" element={<Logout />} />

      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowed={["parent"]} />}>
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
        </Route>

        <Route element={<RequireRole allowed={["student"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Default route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
