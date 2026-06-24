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
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
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
        return <LoginView onLoginSuccess={() => setActiveTab('profile')} />;
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

  return (
    <div className="min-h-screen bg-background text-white pb-24 md:pb-0">
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
