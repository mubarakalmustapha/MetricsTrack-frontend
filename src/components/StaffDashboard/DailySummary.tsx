import React from 'react';
import { Calendar } from 'lucide-react';

interface DailySummaryProps {
  currentValue: number;
  targetValue: number; 
}

const DailySummary: React.FC<DailySummaryProps> = ({ currentValue, targetValue }) => {
  const title = "Today's Progress";
  const gradientFrom = 'blue-500';
  const gradientTo = 'blue-600';

  const progressPercent = Math.round((currentValue / targetValue) * 100);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 bg-gradient-to-tr from-${gradientFrom} to-${gradientTo} rounded-lg flex items-center justify-center`}>
          {<Calendar className="w-6 h-6 text-white" />}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Hours Worked</span>
          <span className={`text-2xl font-bold text-${gradientFrom}`}>{currentValue}h</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{title} Target</span>
            <span>{currentValue}h / {targetValue}h</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">{progressPercent}% of {title.toLowerCase()} target</p>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
