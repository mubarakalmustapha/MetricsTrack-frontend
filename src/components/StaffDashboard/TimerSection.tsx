import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';

interface TimerSectionProps {
  workStartTime: Date;
  workSeconds: number;
  isPaused: boolean;
  toggleTimer: () => void;
  formatStartTime: (date: Date) => string;
  formatTime: (seconds: number) => string;
}

const TimerSection: React.FC<TimerSectionProps> = ({
  workStartTime,
  workSeconds,
  isPaused,
  toggleTimer,
  formatStartTime,
  formatTime,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Active Work Session</h2>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-2">Work Started at</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-3xl font-bold text-green-600">{formatStartTime(workStartTime)}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-4">Time Worked</p>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-lg">
            <div className="text-5xl font-mono font-bold text-white mb-4">{formatTime(workSeconds)}</div>
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'
                }`}
              ></div>
              <span className="text-white/90 font-medium">{isPaused ? 'Paused' : 'Running'}</span>
            </div>
          </div>
        </div>

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
  );
};

export default TimerSection;