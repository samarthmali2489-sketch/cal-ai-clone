import React, { useMemo } from 'react';
import { FoodItem } from '../types';

interface HistoryProps {
  logs: FoodItem[];
  onBack: () => void;
  onLogClick: (log: FoodItem) => void;
}

const History: React.FC<HistoryProps> = ({ logs, onBack, onLogClick }) => {
  
  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: FoodItem[] } = {};
    
    // Sort logs by newest first
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedLogs.forEach(log => {
      const dateKey = new Date(log.timestamp).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });
    
    return groups;
  }, [logs]);

  const dates = Object.keys(groupedLogs);

  return (
    <div className="p-6 pb-24 animate-fade-in min-h-screen bg-black">
      <header className="flex items-center gap-4 mb-8 sticky top-0 bg-black/80 backdrop-blur-md py-4 -mx-6 px-6 z-10 border-b border-neutral-900">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-neutral-400"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">History</h1>
          <p className="text-xs text-neutral-500">{logs.length} total entries</p>
        </div>
      </header>

      {dates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-4">
            <i className="fa-regular fa-clock text-2xl"></i>
          </div>
          <p>No history yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map(date => {
            const dayLogs = groupedLogs[date];
            const dayCalories = dayLogs.reduce((sum, item) => sum + item.calories, 0);
            const dayProtein = dayLogs.reduce((sum, item) => sum + item.protein, 0);

            return (
              <div key={date} className="animate-slide-up">
                <div className="flex justify-between items-end mb-3 px-2">
                  <h3 className="font-bold text-lg text-white">{date}</h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {Math.round(dayCalories)} kcal • {Math.round(dayProtein)}g pro
                  </p>
                </div>
                
                <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
                  {dayLogs.map((log, idx) => (
                    <button
                      key={log.id}
                      onClick={() => onLogClick(log)}
                      className={`w-full flex justify-between items-center p-4 hover:bg-neutral-800 transition-colors text-left ${
                        idx !== dayLogs.length - 1 ? 'border-b border-neutral-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg">
                          🍽️
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{log.name}</p>
                          <p className="text-[10px] text-neutral-500 capitalize">{log.mealType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-sm text-neutral-200">{Math.round(log.calories)}</p>
                         <p className="text-[10px] text-neutral-500">kcal</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;