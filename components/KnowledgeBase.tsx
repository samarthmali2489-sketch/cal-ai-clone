import React, { useState, useEffect, useRef } from 'react';
import { searchNutritionInfo } from '../services/geminiService';
import { ChatMessage, FoodItem, UserGoals, UserProfile } from '../types';

interface KnowledgeBaseProps {
  logs: FoodItem[];
  userProfile: UserProfile | null;
  goals: UserGoals;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ logs, userProfile, goals }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi, I can help you research nutrition facts and analyze your diet. I have access to your logs and goals. What would you like to know?',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContext = () => {
    if (!userProfile) return '';

    const today = new Date().toLocaleDateString();
    const todayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === today);
    const todayCals = todayLogs.reduce((a, b) => a + b.calories, 0);
    const todayProt = todayLogs.reduce((a, b) => a + b.protein, 0);

    // Get stats from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogs = logs.filter(l => new Date(l.timestamp) >= weekAgo);
    const weekCals = weekLogs.reduce((a,b) => a + b.calories, 0);
    const avgCals = weekLogs.length > 0 ? Math.round(weekCals / 7) : 0;

    const context = `
    USER PROFILE:
    Name: ${userProfile.name}
    Stats: ${userProfile.age}yo, ${userProfile.gender}, ${userProfile.weight}kg, ${userProfile.height}cm
    Goal: ${userProfile.goal} (Target: ${goals.calories} kcal/day, ${goals.protein}g protein/day)
    Activity: ${userProfile.activityLevel}

    CURRENT STATUS (Today):
    Consumed: ${Math.round(todayCals)} kcal, ${Math.round(todayProt)}g protein
    Remaining: ${Math.round(goals.calories - todayCals)} kcal
    
    TODAY'S LOGS:
    ${todayLogs.length > 0 ? todayLogs.map(l => `- ${l.name} (${Math.round(l.calories)}kcal, ${l.protein}g pro, ${l.carbs}g carb, ${l.fat}g fat)`).join('\n') : "No food logged today yet."}
    
    WEEKLY TREND:
    Average Daily Calories (Past 7 days): ~${avgCals} kcal
    `;
    return context;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const context = generateContext();
      const response = await searchNutritionInfo(userMsg.text, context);
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text,
        sources: response.sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4 animate-fade-in">
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Research & Analysis</h1>
        <p className="text-neutral-500 text-sm">Powered by Gemini & Google Search</p>
      </header>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white text-black rounded-tr-none' 
                : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none'
            }`}>
              {msg.text}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <p className="text-xs font-semibold text-neutral-500 mb-2">SOURCES</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-neutral-800 px-2 py-1 rounded hover:bg-neutral-700 truncate max-w-[150px] inline-block text-neutral-300"
                      >
                         <i className="fa-solid fa-link mr-1 text-[10px]"></i> {source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-neutral-900 p-4 rounded-2xl rounded-tl-none border border-neutral-800">
               <div className="flex space-x-2">
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
           </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-6 pr-12 py-4 text-white focus:outline-none focus:border-neutral-600 transition-colors"
          placeholder="Ask about your diet or nutrition..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-2 h-10 w-10 bg-white rounded-full flex items-center justify-center text-black disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all hover:scale-105"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBase;