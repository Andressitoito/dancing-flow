import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import MyStepsView from './components/MyStepsView';
import EditorView from './components/EditorView';
import ChoreoViewerView from './components/ChoreoViewerView';
import LoginView from './components/LoginView';

function App() {
  const { user, fetchInitialData, loading, stopPlayback } = useStore();
  const [activeTab, setActiveTab] = useState(user ? 'editor' : 'viewer');

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Stop playback when switching away from Viewer
  useEffect(() => {
    if (activeTab !== 'viewer') {
      stopPlayback();
    }
  }, [activeTab, stopPlayback]);

  // Handle protected tabs
  const handleTabChange = (tab) => {
    if ((tab === 'editor' || tab === 'steps') && !user) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'editor':
        return <EditorView />;
      case 'steps':
        return <MyStepsView />;
      case 'viewer':
        return <ChoreoViewerView />;
      case 'login':
        return <LoginView />;
      default:
        return <EditorView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      <main className="max-w-md mx-auto">
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
