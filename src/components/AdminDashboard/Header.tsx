import React from 'react';
import type { AdminUser } from '../../types/index';
import { Users, LogOut } from 'lucide-react';

interface HeaderProps {
  user: AdminUser;
  onlineCount: number;
  totalStaff: number;
  weekTotalHours: string;
  showLogoutConfirm: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onlineCount, totalStaff, weekTotalHours, showLogoutConfirm, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user.name}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="text-center"><p className="text-2xl font-bold text-green-600">{onlineCount}</p><p className="text-xs text-gray-600">Online</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-blue-600">{totalStaff}</p><p className="text-xs text-gray-600">Total Staff</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-purple-600">{weekTotalHours}</p><p className="text-xs text-gray-600">Week Total</p></div>
        </div>

        <button
          onClick={onLogout}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${showLogoutConfirm ? 'bg-red-600 text-white scale-105' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
        >
          <LogOut className="w-5 h-5" />
          <span>{showLogoutConfirm ? 'Confirm Logout' : 'Logout'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
