import React from "react";
import { Search} from "lucide-react";
import StaffTable from './StaffTable';
import type { StaffUser } from "../../types/index";

interface StaffListProps {
  filteredStaff: StaffUser[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (value: "all" | "active" | "inactive") => void;
  handleStaffAction: (id: number, action: "reset" | "deactivate" | "activate") => void;
}

const StaffList: React.FC<StaffListProps> = ({
  filteredStaff,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  handleStaffAction,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Staff Members</h2>
            <p className="text-gray-600 text-sm">Manage your team members</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <StaffTable
        filteredStaff={filteredStaff}
        handleStaffAction={handleStaffAction}
      />
    </div>
  );
};

export default StaffList;
