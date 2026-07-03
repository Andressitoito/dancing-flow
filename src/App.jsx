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
            <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="text-center">
            <h1 className="font-sora text-3xl font-black italic uppercase tracking-tighter text-white">Dancing <span className="text-primary">Flow</span></h1>
            <p className="font-sora text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-4 animate-pulse italic">Preparando el Templo</p>
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

  const isFullBleed = ['home', 'about', 'login'].includes(activeTab);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={`flex-1 w-full mx-auto ${isFullBleed ? 'max-w-none px-0' : 'max-container px-6 md:px-16 py-12 md:py-24'} mt-[56px] transition-all duration-700`}>
        {renderContent()}
      </main>

      {!isFullBleed && (
        <footer className="py-12 border-t border-white/5 bg-black/20">
           <div className="max-container px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="font-sora text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">© 2024 Dancing Flow Academy. Mastery is a journey.</p>
              <div className="flex gap-12">
                 <span className="font-sora text-[10px] font-black text-zinc-700 uppercase tracking-widest italic cursor-pointer hover:text-primary transition-colors">Instagram</span>
                 <span className="font-sora text-[10px] font-black text-zinc-700 uppercase tracking-widest italic cursor-pointer hover:text-primary transition-colors">TikTok</span>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
}

export default App;
