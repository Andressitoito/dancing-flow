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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
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
        return <HomeView />;
    }
  };

  const isFullBleed = ['home', 'about'].includes(activeTab);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={`flex-1 w-full mx-auto ${isFullBleed ? 'max-w-none px-0' : 'max-w-7xl px-4 md:px-6 py-4 md:py-8'} mt-0 md:mt-[80px] mb-[72px] md:mb-0`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
