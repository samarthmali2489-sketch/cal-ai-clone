import React, { useState } from 'react';
import { UserProfile, UserGoals } from '../types';
import { calculateNutritionPlan } from '../services/geminiService';
import { Button } from './ui/Button';

interface OnboardingProps {
  onComplete: (profile: UserProfile, goals: UserGoals) => void;
}

const steps = [
  { id: 'basics', title: "Let's get to know you" },
  { id: 'stats', title: "Body Stats" },
  { id: 'lifestyle', title: "Lifestyle & Goals" },
  { id: 'calculating', title: "Analyzing..." }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    gender: 'male',
    age: 25,
    height: 175,
    weight: 70,
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const handleNext = async () => {
    if (step < steps.length - 2) {
      setStep(step + 1);
    } else {
      // Final step triggers calculation
      setStep(step + 1);
      try {
        const goals = await calculateNutritionPlan(formData);
        onComplete(formData, goals);
      } catch (e) {
        console.error("Failed to calculate", e);
        // Fallback or error handling
        setStep(step); // Go back
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-black text-white animate-fade-in">
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-neutral-900 mb-8 rounded-full">
        <div 
          className="h-full bg-white transition-all duration-500 rounded-full" 
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{steps[step].title}</h1>
        <p className="text-neutral-500 mb-8">Step {step + 1} of {steps.length}</p>

        <div className="flex-1 overflow-y-auto space-y-6">
          
          {/* STEP 1: BASICS */}
          {step === 0 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm text-neutral-400 mb-2 font-medium">What should we call you?</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-400 mb-2 font-medium">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => updateField('gender', g)}
                      className={`py-4 rounded-xl border font-medium transition-all ${
                        formData.gender === g 
                          ? 'bg-white text-black border-white' 
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STATS */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
               <div>
                <label className="block text-sm text-neutral-400 mb-2 font-medium">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2 font-medium">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => updateField('height', Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2 font-medium">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => updateField('weight', Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm text-neutral-400 mb-2 font-medium">Activity Level</label>
                <div className="space-y-2">
                  {[
                    { val: 'sedentary', label: 'Sedentary (Office job)' },
                    { val: 'light', label: 'Light (1-2 days/week)' },
                    { val: 'moderate', label: 'Moderate (3-5 days/week)' },
                    { val: 'active', label: 'Active (6-7 days/week)' },
                    { val: 'very_active', label: 'Very Active (Physical job)' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => updateField('activityLevel', opt.val)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                        formData.activityLevel === opt.val 
                          ? 'bg-white text-black border-white' 
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {formData.activityLevel === opt.val && <i className="fa-solid fa-check"></i>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2 font-medium">Primary Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'lose_weight', label: 'Lose Fat' },
                    { val: 'maintain', label: 'Maintain' },
                    { val: 'gain_muscle', label: 'Build Muscle' }
                  ].map((g) => (
                    <button
                      key={g.val}
                      onClick={() => updateField('goal', g.val)}
                      className={`py-4 px-2 rounded-xl border text-sm font-medium transition-all ${
                        formData.goal === g.val 
                          ? 'bg-white text-black border-white' 
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

           {/* STEP 4: LOADING */}
           {step === 3 && (
            <div className="flex flex-col items-center justify-center h-full animate-pulse">
               <div className="w-16 h-16 border-4 border-neutral-800 border-t-white rounded-full animate-spin mb-6"></div>
               <p className="text-lg font-medium text-center">Gemini is designing your perfect nutrition plan...</p>
               <p className="text-sm text-neutral-500 mt-2 text-center">Calculating TDEE & Macros</p>
            </div>
          )}
        </div>
      </div>

      {step < 3 && (
        <div className="pt-4 flex gap-4">
          {step > 0 && (
            <Button variant="secondary" onClick={handleBack} className="w-1/3">
              Back
            </Button>
          )}
          <Button fullWidth onClick={handleNext}>
            {step === 2 ? "Generate Plan" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
