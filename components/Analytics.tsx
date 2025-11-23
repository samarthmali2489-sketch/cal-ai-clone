import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import { BarChart, ChartDataPoint } from './ui/Chart';

interface AnalyticsProps {
  logs: FoodItem[];
}

type TimeRange = 'day' | 'week' | 'month';
type Metric = 'calories' | 'protein';

const Analytics: React.FC<AnalyticsProps> = ({ logs }) => {
  const [range, setRange] = useState<TimeRange>('week');
  const [metric, setMetric] = useState<Metric>('calories');

  const chartData: ChartDataPoint[] = useMemo(() => {
    const now = new Date();
    const data: ChartDataPoint[] = [];

    if (range === 'day') {
      // Group by meal type for today
      const today = now.toLocaleDateString();
      const todayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === today);
      
      const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
      meals.forEach(meal => {
        const val = todayLogs
          .filter(l => l.mealType === meal)
          .reduce((sum, item) => sum + (metric === 'calories' ? item.calories : item.protein), 0);
        data.push({ label: meal.charAt(0).toUpperCase() + meal.slice(1), value: Math.round(val) });
      });

    } else if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toLocaleDateString();
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === dateStr);
        const val = dayLogs.reduce((sum, item) => sum + (metric === 'calories' ? item.calories : item.protein), 0);
        
        data.push({ label: dayName, value: Math.round(val) });
      }

    } else if (range === 'month') {
      // Last 14 days
       for (let i = 13; i >= 0; i--) {
         const d = new Date();
         d.setDate(now.getDate() - i);
         const dateStr = d.toLocaleDateString();
         
         const dayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === dateStr);
         const val = dayLogs.reduce((sum, item) => sum + (metric === 'calories' ? item.calories : item.protein), 0);
         
         data.push({ label: d.getDate().toString(), value: Math.round(val) });
       }
    }
    
    return data;
  }, [logs, range, metric]);

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const avgValue = Math.round(totalValue / chartData.length) || 0;

  return (
    <div className="p-6 pb-24 animate-fade-in flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
        <p className="text-neutral-500 text-sm">Track your intake trends</p>
      </header>

      {/* Controls */}
      <div className="flex bg-neutral-900 p-1 rounded-xl mb-6">
        {(['day', 'week', 'month'] as TimeRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
              range === r ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMetric('calories')}
          className={`flex-1 p-4 rounded-2xl border transition-all text-left ${
            metric === 'calories' ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <i className="fa-solid fa-fire text-lg"></i>
            {metric === 'calories' && <i className="fa-solid fa-circle-check"></i>}
          </div>
          <p className="font-bold text-lg">Calories</p>
        </button>
        
        <button 
          onClick={() => setMetric('protein')}
          className={`flex-1 p-4 rounded-2xl border transition-all text-left ${
            metric === 'protein' ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <i className="fa-solid fa-drumstick-bite text-lg"></i>
            {metric === 'protein' && <i className="fa-solid fa-circle-check"></i>}
          </div>
          <p className="font-bold text-lg">Protein</p>
        </button>
      </div>

      {/* Main Chart Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">
              {range === 'day' ? 'Today Total' : `Average ${metric}`}
            </p>
            <p className="text-3xl font-bold">
              {range === 'day' ? totalValue : avgValue}
              <span className="text-sm font-normal text-neutral-500 ml-1">
                {metric === 'calories' ? 'kcal' : 'g'}
              </span>
            </p>
          </div>
        </div>
        
        <BarChart 
          data={chartData} 
          color={metric === 'calories' ? 'bg-white' : 'bg-neutral-400'} 
          unit={metric === 'calories' ? '' : 'g'}
        />
      </div>

      {/* Insights / Stats */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Insights</h3>
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex items-start gap-4">
          <div className="bg-neutral-800 p-3 rounded-full">
            <i className="fa-solid fa-chart-line text-white"></i>
          </div>
          <div>
            <p className="font-bold text-sm mb-1">Protein Consistency</p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {avgValue > 100 
                ? "You're consistently hitting high protein numbers. Great for muscle retention!" 
                : "Your protein intake varies. Try to include a protein source in every meal."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;