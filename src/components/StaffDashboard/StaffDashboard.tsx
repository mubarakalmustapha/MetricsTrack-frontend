import React, { useState, useEffect } from 'react';
import { Clock, LogOut, BarChart3, Trophy, Target, Calendar, Pause, Play } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  workStartTime: Date;
}

interface StaffDashboardProps {
  user: StaffUser;
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workSeconds, setWorkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const hoursToday = "3h 20m";
  const hoursWeek = "15h 40m";
  const weeklyTarget = 40;
  const weeklyProgress = 15.67;
  const dailyTarget = 8;
  const dailyProgress = 3.33;

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - user.workStartTime.getTime()) / 1000);
        setWorkSeconds(diffInSeconds);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [user.workStartTime, isPaused]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatStartTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const handleLogout = () => {
    if (showLogoutConfirm) {
      onLogout();
    } else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  const toggleTimer = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Welcome Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {user.name} 👋
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

            {/* Logout Button */}
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Timer Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="text-center">
              {/* Timer Header */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Active Work Session</h2>
              </div>

              {/* Work Start Time */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg mb-2">Work Started at</p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-3xl font-bold text-green-600">
                    {formatStartTime(user.workStartTime)}
                  </p>
                </div>
              </div>

              {/* Live Timer Display */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg mb-4">Time Worked</p>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-lg">
                  <div className="text-5xl font-mono font-bold text-white mb-4">
                    {formatTime(workSeconds)}
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`}></div>
                    <span className="text-white/90 font-medium">
                      {isPaused ? 'Paused' : 'Running'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isPaused 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  } hover:scale-105 shadow-lg`}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Today's Progress</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Hours Worked</span>
                  <span className="text-2xl font-bold text-blue-600">{hoursToday}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Daily Target</span>
                    <span>{dailyProgress}h / {dailyTarget}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(dailyProgress / dailyTarget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {Math.round((dailyProgress / dailyTarget) * 100)}% of daily target
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">This Week</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Hours</span>
                  <span className="text-2xl font-bold text-indigo-600">{hoursWeek}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Weekly Target</span>
                    <span>{weeklyProgress}h / {weeklyTarget}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(weeklyProgress / weeklyTarget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {Math.round((weeklyProgress / weeklyTarget) * 100)}% of weekly target
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Great Job!</h3>
              <p className="text-white/90 text-sm">
                You're on track to meet your weekly goals. Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;