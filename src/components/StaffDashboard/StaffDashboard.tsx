import React, { useState, useEffect } from 'react';
import Header from './Header';
import TimerSection from './TimerSection';
import DailySummary from './DailySummary';
import WeeklySummary from './WeeklySummary';
import PerformanceBadge from './PerformanceBadge';
import { type StaffUser } from '../../types/index'; 

interface StaffDashboardProps {
  user: StaffUser
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workSeconds, setWorkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const hoursToday = user.hoursToday ? parseFloat(user.hoursToday) : 3.33;
  const dailyTarget = 8;

  const hoursWeek = user.hoursWeek ? parseFloat(user.hoursWeek) : 15.67;
  const weeklyProgress = hoursWeek;
  const weeklyTarget = 40;

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - user.workStartTime.getTime()) / 1000
        );
        setWorkSeconds(diffInSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [user.workStartTime, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatStartTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const handleLogout = () => {
    if (showLogoutConfirm) onLogout();
    else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  const toggleTimer = () => setIsPaused(!isPaused);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        userName={user.firstName}
        currentTime={currentTime}
        handleLogout={handleLogout}
        showLogoutConfirm={showLogoutConfirm}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <TimerSection
            workStartTime={user.workStartTime}
            workSeconds={workSeconds}
            isPaused={isPaused}
            toggleTimer={toggleTimer}
            formatStartTime={formatStartTime}
            formatTime={formatTime}
          />

          <div className="space-y-6">
            <DailySummary currentValue={hoursToday} targetValue={dailyTarget} />
            <WeeklySummary
              hoursWeek={hoursWeek}
              weeklyProgress={weeklyProgress}
              weeklyTarget={weeklyTarget}
            />
            <PerformanceBadge
              title="Amazing Work!"
              message="You're on track to meet your weekly goals. Keep up the excellent work!"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;