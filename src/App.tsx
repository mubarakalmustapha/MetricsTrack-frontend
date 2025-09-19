import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import StaffDashboard from "./components/StaffDashboard";
import AdminLayout from "./components/AdminLayout";

type User = {
  email: string;
  role: "admin" | "staff";
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string, role: "admin" | "staff") => {
    const user = { email, role };
    setCurrentUser(user);
    navigate(role === "staff" ? "/staff-dashboard" : "/admin-dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/staff-dashboard"
        element={
          currentUser && currentUser.role === "staff" ? (
            <StaffDashboard
              user={{
                id: "1",
                name: currentUser.email.split("@")[0],
                email: currentUser.email,
                workStartTime: new Date(),
              }}
              onLogout={handleLogout}
            />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          currentUser && currentUser.role === "admin" ? (
            <AdminLayout user={currentUser} onLogout={handleLogout} />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
    </Routes>
  );
}
