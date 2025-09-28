import React from "react";
import { Shield, Calendar, Key, UserX, Check } from "lucide-react";
import type { StaffUser } from "../../types/index";

interface StaffTableProps {
  filteredStaff: StaffUser[];
  handleStaffAction: (
    staffId: number,
    action: "reset" | "deactivate" | "activate"
  ) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  filteredStaff,
  handleStaffAction,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Staff Member
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Role
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Presence
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Created
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Last Login
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredStaff.map((staff) => (
            <tr
              key={staff.id}
              className="hover:bg-blue-50/50 transition-colors"
            >
              {/* Staff Member */}
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

              {/* Role */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    staff.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
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

              {/* Presence */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    staff.presence === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {staff.presence === "active" ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(staff.workStartTime).toLocaleDateString()}
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {staff.latestWorkLog?.loginTime
                    ? new Date(staff.latestWorkLog.loginTime).toLocaleDateString()
                    : "Never"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                  {/* Reset Password */}
                  <button
                    onClick={() => handleStaffAction(staff.id, "reset")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Reset Password"
                  >
                    <Key className="w-4 h-4" />
                  </button>

                  {/* Activate / Deactivate */}
                  <button
                    onClick={() =>
                      handleStaffAction(
                        staff.id,
                        staff.presence === "active"
                          ? "deactivate"
                          : "activate"
                      )
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      staff.presence === "active"
                        ? "text-red-600 hover:bg-red-100"
                        : "text-green-600 hover:bg-green-100"
                    }`}
                    title={
                      staff.presence === "active" ? "Deactivate" : "Activate"
                    }
                  >
                    {staff.presence === "active" ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
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
