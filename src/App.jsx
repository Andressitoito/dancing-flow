import React, { useState, useEffect } from 'react';
import useStore from './store/useStore';

import HomeView from "./views/HomeView";
import AboutUsView from "./views/AboutUsView";
import LoginView from "./views/LoginView";
import StudentProfileView from "./views/StudentProfileView";
import StudentTrainingView from "./views/StudentTrainingView";
import AdminControlView from "./views/AdminControlView";

import Navbar from "./components/Navbar";
import { DFContainer } from './components/ui';

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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-df-bg text-df-primary">
        <div className="animate-spin h-8 w-8 border-t-2 border-df-primary rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
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

  const isFullBleed = ['home', 'about', 'training'].includes(activeTab);

  return (
    <div className="min-h-screen bg-df-bg text-df-text flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={`flex-1 w-full mx-auto ${isFullBleed ? 'max-w-none px-0' : ''} mt-[64px]`}>
        {isFullBleed ? (
            renderContent()
        ) : (
            <DFContainer className="py-10">
                {renderContent()}
            </DFContainer>
        )}
      </main>
    </div>
  );
}

export default App;
