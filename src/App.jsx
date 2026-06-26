import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import StudentProfileView from './components/StudentProfileView';
import StudentTrainingView from './components/StudentTrainingView';
import AdminControlView from './components/AdminControlView';
import AboutUsView from './components/AboutUsView';

function App() {
  const { user, fetchInitialData, loading } = useStore();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleTabChange = (tab) => {
    if (!user && ['profile', 'training', 'admin'].includes(tab)) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-white gap-8">
        <div className="relative">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="text-center">
            <h1 className="font-sora text-2xl font-black italic uppercase tracking-tighter text-white">Dancing <span className="text-primary">Flow</span></h1>
            <p className="font-sora text-label-sm font-black text-zinc-800 uppercase tracking-[0.4em] mt-2 animate-pulse">Preparando el Templo</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onTabChange={handleTabChange} />;
      case 'about':
        return <AboutUsView />;
      case 'login':
        return <LoginView onLoginSuccess={(loggedInUser) => {
          if (loggedInUser?.role === 'profesor') {
            setActiveTab('admin');
          } else {
            setActiveTab('profile');
          }
        }} />;
      case 'profile':
        return <StudentProfileView />;
      case 'training':
        return <StudentTrainingView />;
      case 'admin':
        return <AdminControlView />;
      default:
        return <HomeView onTabChange={handleTabChange} />;
    }
  };

  const isFullBleed = ['home', 'about'].includes(activeTab);

  return (
    <div className="min-h-screen bg-background text-df-text-main flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={`flex-1 w-full mx-auto ${isFullBleed ? 'max-w-none px-0' : 'max-container px-6 md:px-12 py-10 md:py-20'} mt-[56px] transition-all duration-700`}>
        {renderContent()}
      </main>

      {!isFullBleed && (
        <footer className="py-10 border-t border-white/5 bg-black/40">
           <div className="max-container px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="font-sora text-label-sm font-black text-zinc-700 uppercase tracking-[0.2em] italic">© 2024 Dancing Flow Academy. Mastery is a journey.</p>
              <div className="flex gap-8">
                 <span className="font-sora text-label-sm font-black text-zinc-800 uppercase tracking-widest italic cursor-pointer hover:text-primary transition-colors">Instagram</span>
                 <span className="font-sora text-label-sm font-black text-zinc-800 uppercase tracking-widest italic cursor-pointer hover:text-primary transition-colors">TikTok</span>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
}

export default App;
