import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import StaffDashboard from "./components/StaffDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminRegister from "./components/AdminRegister";
import { v4 as uuidv4 } from "uuid";



type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
};

type AdminUser = User & {
  id: string;
  name: string;
};


interface AdminRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | AdminUser | null>(null);
  const navigate = useNavigate();

  const handleRegister = (data: AdminRegisterForm) => {
    // Create a sample AdminUser object
    const newAdminUser: AdminUser = {
      id: uuidv4(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: "admin",
    };

    setCurrentUser(newAdminUser);

    navigate("/admin-dashboard");
  };


  const handleLogin = (email: string, password: string, role: "admin" | "staff") => {
    if (role === "admin") {
      const user: AdminUser = {
        id: "1",
        name: email.split("@")[0],
        email,
        role,
      };
      setCurrentUser(user);
      navigate("/admin-dashboard");
    } else {
      const user: User = { email, role };
      setCurrentUser(user);
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
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          currentUser && currentUser.role === "admin" ? (
            <AdminLayout user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

  );
}