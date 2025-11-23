import React, { useState, useRef } from 'react';
import { analyzeFoodLog } from '../services/geminiService';
import { FoodItem, SearchResult } from '../types';
import { Button } from './ui/Button';

interface AddLogProps {
  onAddLog: (items: FoodItem[]) => void;
  onCancel: () => void;
}

const AddLog: React.FC<AddLogProps> = ({ onAddLog, onCancel }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!input && !selectedImage) return;
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      // Strip header from base64 if present for the API call
      const base64Data = selectedImage ? selectedImage.split(',')[1] : undefined;
      const data = await analyzeFoodLog(input || (selectedImage ? "Identify this food" : ""), base64Data);
      setResults(data);
    } catch (error) {
      console.error(error);
      setError("Failed to analyze. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const newItems: FoodItem[] = results.map(r => ({
      id: crypto.randomUUID(),
      name: r.foodName,
      calories: r.calories,
      protein: r.macros.protein,
      carbs: r.macros.carbs,
      fat: r.macros.fat,
      timestamp: Date.now(),
      mealType: 'snack', // Defaulting for simplicity
      micronutrients: r.micronutrients
    }));
    onAddLog(newItems);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-black min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-2">
        <button 
          onClick={onCancel} 
          className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <span className="text-sm font-semibold tracking-wide uppercase text-neutral-500">New Entry</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <h1 className="text-3xl font-bold mb-8 mt-2">What did you eat?</h1>

        <div className="space-y-6">
          {/* Image Action Area */}
          {!selectedImage ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Camera Button */}
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="h-32 bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col items-center justify-center gap-3 hover:bg-neutral-800 hover:scale-[1.02] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black mb-1 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-shadow">
                  <i className="fa-solid fa-camera text-xl"></i>
                </div>
                <span className="text-sm font-medium">Take Photo</span>
              </button>

              {/* Gallery Button */}
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="h-32 bg-neutral-900 rounded-3xl border border-neutral-800 flex flex-col items-center justify-center gap-3 hover:bg-neutral-800 hover:scale-[1.02] transition-all active:scale-95 group"
              >
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 mb-1 border border-neutral-700 group-hover:border-white group-hover:text-white transition-colors">
                  <i className="fa-solid fa-image text-xl"></i>
                </div>
                <span className="text-sm font-medium text-neutral-400 group-hover:text-white">Upload</span>
              </button>
              
              {/* Hidden Inputs */}
              <input 
                type="file" 
                ref={cameraInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageUpload}
              />
              <input 
                type="file" 
                ref={galleryInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 group">
              <img src={selectedImage} alt="Preview" className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={removeImage}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
                <i className="fa-solid fa-check mr-2 text-green-400"></i> Image Attached
              </div>
            </div>
          )}

          {/* Text Input */}
          <div className="relative">
            <div className="absolute top-4 left-4 text-neutral-500 pointer-events-none">
              <i className="fa-solid fa-pen"></i>
            </div>
            <textarea
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-3xl p-4 pl-10 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:bg-neutral-900 transition-all resize-none h-40"
              placeholder="Describe your meal (e.g. 2 eggs, avocado toast...)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-200 text-sm flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              {error}
            </div>
          )}
          
          {/* Analyze Button */}
          <div className="pt-4">
             <Button 
              fullWidth 
              onClick={handleAnalyze} 
              disabled={isLoading || (!input && !selectedImage)}
              className="h-14 text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                </span>
              ) : "Analyze Nutrition"}
            </Button>
          </div>

          {/* Results Area */}
          {results.length > 0 && (
            <div className="mt-8 space-y-4 animate-slide-up pb-8">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-yellow-500"></i>
                <h3 className="font-semibold text-lg">Analysis Results</h3>
              </div>
              
              {results.map((item, idx) => (
                <div key={idx} className="bg-neutral-900 p-5 rounded-3xl border border-neutral-800 flex justify-between items-center hover:border-neutral-600 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{item.foodName}</p>
                    <p className="text-xs text-neutral-400">{item.description}</p>
                    <div className="flex gap-3 mt-2">
                        <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-neutral-300">P: {item.macros.protein}g</span>
                        <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-neutral-300">C: {item.macros.carbs}g</span>
                        <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-neutral-300">F: {item.macros.fat}g</span>
                    </div>
                  </div>
                  <div className="text-right pl-4 border-l border-neutral-800 ml-4">
                    <p className="font-black text-2xl">{item.calories}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">kcal</p>
                  </div>
                </div>
              ))}
              
              <Button fullWidth onClick={handleSave} variant="secondary" className="mt-4 border-dashed border-2">
                <i className="fa-solid fa-plus mr-2"></i>
                Add {results.reduce((a, b) => a + b.calories, 0)} kcal to Log
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLog;