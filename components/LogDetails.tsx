import React from 'react';
import { FoodItem } from '../types';

interface LogDetailsProps {
  log: FoodItem;
  onClose: () => void;
}

const LogDetails: React.FC<LogDetailsProps> = ({ log, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-neutral-800 p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">{log.name}</h2>
            <p className="text-sm text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()} • {log.mealType}</p>
          </div>
          <button onClick={onClose} className="bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 transition-colors">
            <i className="fa-solid fa-xmark text-neutral-400"></i>
          </button>
        </div>

        {/* Nutrition Label Style */}
        <div className="bg-white text-black p-4 rounded-xl font-mono mb-6">
          <h3 className="text-2xl font-black border-b-4 border-black pb-1 mb-1">Nutrition Facts</h3>
          
          <div className="flex justify-between items-baseline border-b border-black py-2 mb-2">
            <span className="font-bold text-xl">Calories</span>
            <span className="font-bold text-3xl">{Math.round(log.calories)}</span>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between border-b border-neutral-300 py-1">
              <span className="font-bold">Total Fat <span className="font-normal">{log.fat}g</span></span>
              <span className="font-bold">{Math.round((log.fat / 65) * 100)}%</span>
            </div>
            {log.micronutrients?.saturatedFat !== undefined && (
              <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
                <span>Saturated Fat {log.micronutrients.saturatedFat}g</span>
              </div>
            )}
            
            <div className="flex justify-between border-b border-neutral-300 py-1">
              <span className="font-bold">Cholesterol <span className="font-normal">{log.micronutrients?.cholesterol || 0}mg</span></span>
              <span className="font-bold">{Math.round(((log.micronutrients?.cholesterol || 0) / 300) * 100)}%</span>
            </div>
            
            <div className="flex justify-between border-b border-neutral-300 py-1">
              <span className="font-bold">Sodium <span className="font-normal">{log.micronutrients?.sodium || 0}mg</span></span>
              <span className="font-bold">{Math.round(((log.micronutrients?.sodium || 0) / 2300) * 100)}%</span>
            </div>

            <div className="flex justify-between border-b border-neutral-300 py-1">
              <span className="font-bold">Total Carbohydrate <span className="font-normal">{log.carbs}g</span></span>
              <span className="font-bold">{Math.round((log.carbs / 300) * 100)}%</span>
            </div>
            
            <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
              <span>Dietary Fiber {log.micronutrients?.fiber || 0}g</span>
            </div>
            <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
              <span>Total Sugars {log.micronutrients?.sugar || 0}g</span>
            </div>

            <div className="flex justify-between border-b-4 border-black py-1">
              <span className="font-bold">Protein <span className="font-normal">{log.protein}g</span></span>
              <span className="font-bold">{Math.round((log.protein / 50) * 100)}%</span>
            </div>
          </div>

          <div className="mt-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Vitamin D 0mcg</span>
              <span>0%</span>
            </div>
            <div className="flex justify-between">
              <span>Calcium {log.micronutrients?.calcium || 0}%</span>
              <span>{log.micronutrients?.calcium || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Iron {log.micronutrients?.iron || 0}%</span>
              <span>{log.micronutrients?.iron || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Potassium {log.micronutrients?.potassium || 0}mg</span>
              <span>{Math.round(((log.micronutrients?.potassium || 0) / 4700) * 100)}%</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-neutral-800 text-white py-4 rounded-xl font-bold hover:bg-neutral-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LogDetails;