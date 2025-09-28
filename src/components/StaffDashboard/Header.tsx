import React from 'react';
import { BarChart3, LogOut } from 'lucide-react';

interface HeaderProps {
  userName: string ;
  currentTime: Date;
  handleLogout: () => void;
  showLogoutConfirm: boolean;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  currentTime,
  handleLogout,
  showLogoutConfirm,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {userName} 👋
              </h1>
              <p className="text-gray-600 text-sm">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              showLogoutConfirm 
                ? 'bg-red-600 text-white transform scale-105 shadow-lg' 
                : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span>{showLogoutConfirm ? 'Confirm End Session' : 'End Work Session'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;