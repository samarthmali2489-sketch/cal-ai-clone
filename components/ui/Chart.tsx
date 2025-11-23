import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  unit?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  color = "bg-white", 
  height = 150,
  unit = "" 
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid div by zero

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((point, idx) => {
          const percentage = (point.value / maxValue) * 100;
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group relative">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {point.value}{unit}
              </div>
              
              <div 
                className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 ease-out ${color} opacity-80 group-hover:opacity-100`}
                style={{ height: `${percentage}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 mt-2">
        {data.map((point, idx) => (
          <div key={idx} className="flex-1 text-center">
            <p className="text-[10px] text-neutral-500 font-medium uppercase truncate">
              {point.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};