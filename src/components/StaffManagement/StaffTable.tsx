import React from "react";
import { Shield, Calendar, Key, UserX, Check } from "lucide-react";

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "staff" | "admin";
  status: "active" | "inactive";
  createdAt: Date;
  lastLogin?: Date;
}

interface StaffTableProps {
  filteredStaff: StaffMember[];
  handleStaffAction: (staffId: string, action: "reset" | "deactivate" | "activate") => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ filteredStaff, handleStaffAction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff Member</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Login</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredStaff.map((staff) => (
            <tr key={staff.id} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {staff.firstName[0]}
                    {staff.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {staff.firstName} {staff.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{staff.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    staff.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {staff.role === "admin" ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" /> Admin
                    </>
                  ) : (
                    "Staff"
                  )}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    staff.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {staff.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {staff.createdAt.toLocaleDateString()}
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {staff.lastLogin ? staff.lastLogin.toLocaleDateString() : "Never"}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleStaffAction(staff.id, "reset")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Reset Password"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleStaffAction(
                        staff.id,
                        staff.status === "active" ? "deactivate" : "activate"
                      )
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      staff.status === "active" ? "text-red-600 hover:bg-red-100" : "text-green-600 hover:bg-green-100"
                    }`}
                    title={staff.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {staff.status === "active" ? <UserX className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
