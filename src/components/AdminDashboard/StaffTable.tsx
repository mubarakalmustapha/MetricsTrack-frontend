import React from 'react';
import type { StaffUser, FilterPeriod } from '../../types/index';
import { BarChart3, Search } from 'lucide-react';

interface StaffTableProps {
  staff: StaffUser[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPeriod: FilterPeriod;
  onFilterChange: (period: FilterPeriod) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  searchQuery,
  onSearchChange,
  filterPeriod,
  onFilterChange,
}) => {
  const filteredStaff = staff.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHours = (staff: StaffUser): string => {
    switch (filterPeriod) {
      case 'today':
        return staff.hoursToday;
      case 'week':
        return staff.hoursWeek;
      case 'month':
        return staff.hoursMonth;
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Staff Overview</h2>
                <p className="text-gray-600 text-sm">Real-time monitoring and analytics</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                {['today', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => onFilterChange(period as FilterPeriod)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      filterPeriod === period
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Hours{' '}
                  {filterPeriod === 'today'
                    ? 'Today'
                    : filterPeriod === 'week'
                    ? 'This Week'
                    : 'This Month'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {staff.avatar}
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
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            staff.status === 'online'
                              ? 'bg-green-400 animate-pulse'
                              : 'bg-gray-400'
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            staff.status === 'online' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {staff.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                        </span>
                      </div>
                      {staff.workStartTime && staff.status === 'online' && (
                        <p className="text-xs text-gray-500">
                          Since {staff.workStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                      {staff.lastSeen && staff.status === 'offline' && (
                        <p className="text-xs text-gray-500">Last seen {staff.lastSeen}</p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-gray-800">{getHours(staff)}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {staff.department}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;
