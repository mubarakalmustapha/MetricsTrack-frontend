import React from 'react';
import { Target } from 'lucide-react';

interface PerformanceBadgeProps {
  title?: string;
  message?: string;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({
  title = 'Great Job!',
  message = "You're on track to meet your weekly goals. Keep up the excellent work!",
  gradientFrom = 'green-500',
  gradientTo = 'emerald-600',
  iconColor = 'white',
}) => {
  return (
    <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-2xl shadow-xl p-6 text-white text-center`}>
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className={`w-6 h-6 text-${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-white/90 text-sm">{message}</p>
    </div>
  );
};

export default PerformanceBadge;
