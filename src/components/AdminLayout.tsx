import React, { useState } from "react";
import StaffManagement from "./StaffManagement";
import ReportsPage from "./ReportsPage";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

type Page = "dashboard" | "staff" | "reports";

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

type AdminLayoutProps = {
  user: AdminUser;
  onLogout: () => void;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "staff":
        return <StaffManagement onBack={() => setActivePage("dashboard")} />;
      case "reports":
        return <ReportsPage onBack={() => setActivePage("dashboard")} />;
      default:
        return user ? (
          <AdminDashboard user={user} onLogout={onLogout} />
        ) : (
          <div>Please login as admin</div>
        );

    }
  };

  return (
    <div className="min-h-screen flex">

      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">
          Admin Panel {user ? `(${user.email})` : ""}
        </h2>

        <button
          onClick={() => setActivePage("dashboard")}
          className={`px-4 py-2 rounded text-left ${
            activePage === "dashboard"
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActivePage("staff")}
          className={`px-4 py-2 rounded text-left ${
            activePage === "staff"
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          Staff Management
        </button>

        <button
          onClick={() => setActivePage("reports")}
          className={`px-4 py-2 rounded text-left ${
            activePage === "reports"
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          Reports
        </button>

        <button
          onClick={onLogout}
          className="mt-auto px-4 py-2 bg-red-600 rounded text-left hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default AdminLayout;
