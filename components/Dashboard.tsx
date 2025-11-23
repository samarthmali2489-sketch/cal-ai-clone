import React from 'react';
import { FoodItem, UserGoals } from '../types';
import { CircularProgress, LinearProgress } from './ui/ProgressBar';

interface DashboardProps {
  logs: FoodItem[];
  goals: UserGoals;
  onProfileClick: () => void;
  onLogClick: (log: FoodItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, goals, onProfileClick, onLogClick }) => {
  const totals = logs.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remaining = Math.max(0, goals.calories - totals.calories);

  return (
    <div className="p-6 pb-24 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today</h1>
          <p className="text-neutral-500 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        {/* Profile icon header */}
        <button 
          onClick={onProfileClick}
          className="h-10 w-10 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800 hover:bg-neutral-800 transition-colors"
        >
          <i className="fa-solid fa-user text-neutral-400 text-sm"></i>
        </button>
      </header>

      {/* Main Calorie Circle */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        {/* Decorative blur behind the circle */}
        <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-75 pointer-events-none"></div>
        
        <CircularProgress value={totals.calories} max={goals.calories} size={220} strokeWidth={16} />
        
        <div className="mt-8 grid grid-cols-2 gap-12 w-full px-8 text-center">
          <div className="flex flex-col items-center">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Eaten</p>
            <p className="text-2xl font-bold tracking-tight">{Math.round(totals.calories)}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Remaining</p>
            <p className="text-2xl font-bold tracking-tight">{Math.round(remaining)}</p>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="bg-neutral-900/50 rounded-3xl p-6 border border-neutral-800 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 tracking-tight">Macros</h3>
        <LinearProgress 
          value={totals.protein} 
          max={goals.protein} 
          label="Protein" 
          color="bg-white" 
        />
        <LinearProgress 
          value={totals.carbs} 
          max={goals.carbs} 
          label="Carbs" 
          color="bg-neutral-400" 
        />
        <LinearProgress 
          value={totals.fat} 
          max={goals.fat} 
          label="Fat" 
          color="bg-neutral-600" 
        />
      </div>

      {/* Recent Logs List (Simple preview) */}
      <div>
        <h3 className="text-lg font-semibold mb-4 tracking-tight">Recent Logs</h3>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-neutral-600 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
            <i className="fa-solid fa-utensils mb-3 text-2xl opacity-50"></i>
            <p>No food logged today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.slice().reverse().map((log) => (
              <button 
                key={log.id} 
                onClick={() => onLogClick(log)}
                className="w-full flex justify-between items-center bg-neutral-900 p-4 rounded-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-neutral-800 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {/* Simple icon mapping */}
                    🍽️
                  </div>
                  <div>
                    <p className="font-medium text-white">{log.name}</p>
                    <p className="text-xs text-neutral-500">{Math.round(log.calories)} kcal</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-bold text-neutral-300">{log.protein}g Pro</p>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-xs text-neutral-600"></i>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;