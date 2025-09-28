import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import StaffDashboard from "./components/StaffDashboard/StaffDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminRegister from "./components/AdminRegister";
import NotFound from "./components/NotFound";
import { v4 as uuidv4 } from "uuid";
import type { StaffUser, User } from "./types/index";

interface AdminRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

type CurrentUser = User | StaffUser;

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();

  const handleRegister = (data: AdminRegisterForm) => {
    // Create a sample Admin user
    const newAdminUser: User = {
      id: Number(uuidv4()),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: "admin",
      companyId: null,
    };

    setCurrentUser(newAdminUser);
    navigate("/admin-dashboard");
  };

  const handleLogin = (email: string, password: string, role: "admin" | "staff") => {
    if (role === "admin") {
      const user: User = {
        id: 1,
        firstName: email.split("@")[0],
        lastName: "Admin",
        email,
        role,
        companyId: null,
      };
      setCurrentUser(user);
      navigate("/admin-dashboard");
    } else {
      const staff: StaffUser = {
        id: 2,
        firstName: email.split("@")[0],
        lastName: "Staff",
        email,
        role: "staff",
        companyId: null,
        workStartTime: new Date(),
        hoursToday: "0h",
        hoursWeek: "0h",
        hoursMonth: "0h",
        presence: "active",
        status: "online",
        latestWorkLog: {
          loginTime: new Date().toISOString(),
          logoutTime: null,
        },
        lastSeen: new Date().toISOString(),
        department: "Engineering",
        avatar: "",
      };
      setCurrentUser(staff);
      navigate("/staff-dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<AdminRegister onRegister={handleRegister} />} />

      <Route
        path="/staff-dashboard"
        element={
          currentUser && currentUser.role === "staff" ? (
            <StaffDashboard user={currentUser as StaffUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          currentUser && currentUser.role === "admin" ? (
            <AdminLayout admin={currentUser as User} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
