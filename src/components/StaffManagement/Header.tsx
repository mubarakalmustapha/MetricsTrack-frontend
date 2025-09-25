import { Users, UserPlus } from "lucide-react";
import React from "react";

interface HeaderProps {
  onBack: () => void;
  setShowCreateForm: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onBack, setShowCreateForm }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              ←
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                <p className="text-gray-600 text-sm">Create and manage staff accounts</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
