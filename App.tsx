import React, { useState, useEffect, useRef } from 'react';
import { FoodItem, UserGoals, UserProfile, ViewState } from './types';
import Dashboard from './components/Dashboard';
import AddLog from './components/AddLog';
import KnowledgeBase from './components/KnowledgeBase';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import LogDetails from './components/LogDetails';
import History from './components/History';

const App: React.FC = () => {
  // Persistence
  const [logs, setLogs] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('calai_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('calai_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [goals, setGoals] = useState<UserGoals>(() => {
    const saved = localStorage.getItem('calai_goals');
    return saved ? JSON.parse(saved) : {
      calories: 2200,
      protein: 150,
      carbs: 250,
      fat: 70
    };
  });
  
  const [view, setView] = useState<ViewState>(() => {
    // If no profile, force onboarding
    if (!localStorage.getItem('calai_profile')) {
      return ViewState.ONBOARDING;
    }
    return ViewState.DASHBOARD;
  });

  const [selectedLog, setSelectedLog] = useState<FoodItem | null>(null);
  
  // Ref for scroll container to reset scroll on view change
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Save effects
  useEffect(() => {
    localStorage.setItem('calai_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('calai_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('calai_goals', JSON.stringify(goals));
  }, [goals]);

  // Scroll to top on view change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [view]);

  const handleAddLogs = (items: FoodItem[]) => {
    setLogs(prev => [...prev, ...items]);
    setView(ViewState.DASHBOARD);
  };

  const handleOnboardingComplete = (profile: UserProfile, calculatedGoals: UserGoals) => {
    setUserProfile(profile);
    setGoals(calculatedGoals);
    setView(ViewState.DASHBOARD);
  };

  const handleEditProfile = () => {
    setView(ViewState.ONBOARDING);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            logs={logs} 
            goals={goals} 
            onProfileClick={() => setView(ViewState.PROFILE)} 
            onLogClick={setSelectedLog}
          />
        );
      case ViewState.RESEARCH:
        return (
          <KnowledgeBase 
            logs={logs} 
            userProfile={userProfile} 
            goals={goals} 
          />
        );
      case ViewState.ANALYTICS:
        return <Analytics logs={logs} />;
      case ViewState.PROFILE:
        return userProfile ? (
          <Profile 
            userProfile={userProfile} 
            goals={goals} 
            onEdit={handleEditProfile} 
            onHistory={() => setView(ViewState.HISTORY)}
          />
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        );
      case ViewState.HISTORY:
        return (
          <History 
            logs={logs} 
            onBack={() => setView(ViewState.PROFILE)} 
            onLogClick={setSelectedLog}
          />
        );
      case ViewState.ADD_LOG:
        return null; // Handled separately
      default:
        return <Dashboard logs={logs} goals={goals} onProfileClick={() => setView(ViewState.PROFILE)} onLogClick={setSelectedLog} />;
    }
  };

  if (view === ViewState.ADD_LOG) {
    return <AddLog onAddLog={handleAddLogs} onCancel={() => setView(ViewState.DASHBOARD)} />;
  }

  // If onboarding, don't show navigation
  if (view === ViewState.ONBOARDING) {
    return (
      <div className="min-h-screen bg-black text-white max-w-md mx-auto relative border-x border-neutral-900 shadow-2xl overflow-hidden">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white max-w-md mx-auto relative border-x border-neutral-900 shadow-2xl">
      <main className="h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          {renderContent()}
        </div>
        
        {/* Modal for Log Details */}
        {selectedLog && (
          <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
        )}
        
        {/* Bottom Navigation */}
        <nav className="h-20 border-t border-neutral-900 bg-black/95 backdrop-blur-md flex items-center justify-around px-4 pb-2 absolute bottom-0 w-full z-10">
          <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${view === ViewState.DASHBOARD ? 'text-white' : 'text-neutral-600'}`}
          >
            <i className="fa-solid fa-house text-xl mb-1"></i>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.ANALYTICS)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${view === ViewState.ANALYTICS ? 'text-white' : 'text-neutral-600'}`}
          >
            <i className="fa-solid fa-chart-pie text-xl mb-1"></i>
            <span className="text-[10px] font-medium">Analysis</span>
          </button>

          <button 
            onClick={() => setView(ViewState.ADD_LOG)}
            className="flex items-center justify-center w-14 h-14 bg-white text-black rounded-full shadow-lg shadow-white/10 hover:scale-105 transition-all -mt-8 border-4 border-black z-20"
          >
            <i className="fa-solid fa-plus text-xl"></i>
          </button>
          
          <button 
            onClick={() => setView(ViewState.RESEARCH)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${view === ViewState.RESEARCH ? 'text-white' : 'text-neutral-600'}`}
          >
            <i className="fa-solid fa-wand-magic-sparkles text-xl mb-1"></i>
            <span className="text-[10px] font-medium">Research</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.PROFILE)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${view === ViewState.PROFILE || view === ViewState.HISTORY ? 'text-white' : 'text-neutral-600'}`}
          >
             <i className="fa-solid fa-user text-xl mb-1"></i>
             <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;