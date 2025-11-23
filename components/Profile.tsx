import React from 'react';
import { UserProfile, UserGoals } from '../types';
import { Button } from './ui/Button';

interface ProfileProps {
  userProfile: UserProfile;
  goals: UserGoals;
  onEdit: () => void;
  onHistory: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, goals, onEdit, onHistory }) => {
  return (
    <div className="p-6 pb-24 animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <Button variant="ghost" onClick={onEdit} className="!px-3 !py-2 text-sm">
          <i className="fa-solid fa-pen mr-2"></i> Edit
        </Button>
      </header>

      {/* Main Avatar / Name */}
      <div className="flex flex-col items-center mb-10">
        <div className="h-24 w-24 bg-neutral-800 rounded-full flex items-center justify-center mb-4 border-2 border-neutral-700 text-3xl text-neutral-400">
          {userProfile.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold">{userProfile.name}</h2>
        <p className="text-neutral-500 capitalize">{userProfile.gender} • {userProfile.age} yrs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Height</p>
          <p className="text-2xl font-semibold">{userProfile.height} <span className="text-sm text-neutral-600">cm</span></p>
        </div>
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Weight</p>
          <p className="text-2xl font-semibold">{userProfile.weight} <span className="text-sm text-neutral-600">kg</span></p>
        </div>
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">BMI</p>
          <p className="text-2xl font-semibold">{goals.bmi || '-'}</p>
        </div>
        <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">TDEE</p>
          <p className="text-2xl font-semibold">{goals.tdee ? Math.round(goals.tdee) : '-'} <span className="text-sm text-neutral-600">kcal</span></p>
        </div>
      </div>

      {/* Goals Card */}
      <div className="bg-white text-black rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fa-solid fa-bullseye text-6xl"></i>
        </div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Daily Targets
          <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-normal capitalize">{userProfile.goal.replace('_', ' ')}</span>
        </h3>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-4xl font-bold tracking-tighter">{goals.calories}</p>
            <p className="text-sm font-medium opacity-60">Calories / Day</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-100 p-3 rounded-xl">
            <p className="text-xs font-bold text-neutral-500 mb-1">Protein</p>
            <p className="text-lg font-bold">{goals.protein}g</p>
          </div>
          <div className="bg-neutral-100 p-3 rounded-xl">
            <p className="text-xs font-bold text-neutral-500 mb-1">Carbs</p>
            <p className="text-lg font-bold">{goals.carbs}g</p>
          </div>
          <div className="bg-neutral-100 p-3 rounded-xl">
            <p className="text-xs font-bold text-neutral-500 mb-1">Fat</p>
            <p className="text-lg font-bold">{goals.fat}g</p>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider ml-2">Data</h3>
        
        <button 
          onClick={onHistory}
          className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex justify-between items-center hover:bg-neutral-800 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
              <i className="fa-solid fa-clock-rotate-left text-neutral-400"></i>
            </div>
            <div className="text-left">
              <p className="font-medium">Food History</p>
              <p className="text-xs text-neutral-500">View all past entries</p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-neutral-600"></i>
        </button>
      </div>

      {goals.reasoning && (
        <div className="mt-8 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-neutral-400"></i>
            AI Analysis
          </h4>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {goals.reasoning}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;