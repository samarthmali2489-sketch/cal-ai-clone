import React from 'react';

export const LinearProgress: React.FC<{ value: number; max: number; color?: string; label?: string }> = ({ 
  value, 
  max, 
  color = "bg-white",
  label 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full mb-3">
      {label && (
        <div className="flex justify-between text-xs mb-1 font-medium tracking-wide">
          <span className="text-neutral-400">{label}</span>
          <span className="text-white">{Math.round(value)} / {max}g</span>
        </div>
      )}
      <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CircularProgress: React.FC<{ value: number; max: number; size?: number; strokeWidth?: number }> = ({
  value,
  max,
  size = 180,
  strokeWidth = 12
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#171717"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tighter">{Math.round(max - value)}</span>
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-widest mt-1">Remaining</span>
      </div>
    </div>
  );
};