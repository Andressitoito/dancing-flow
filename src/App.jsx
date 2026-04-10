import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import MyStepsView from './components/MyStepsView';
import EditorView from './components/EditorView';
import ChoreoViewerView from './components/ChoreoViewerView';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const { fetchInitialData, loading } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
      default:
        return <EditorView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      <main className="max-w-md mx-auto">
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
