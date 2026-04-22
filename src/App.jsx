import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import MyStepsView from './components/MyStepsView';
import EditorView from './components/EditorView';
import ChoreoViewerView from './components/ChoreoViewerView';
import LoginView from './components/LoginView';
import VideoListView from './components/VideoListView';

import { AlertCircle } from 'lucide-react';

function App() {
  const { user, fetchInitialData, loading, stopPlayback, backendStatus } = useStore();
  const [activeTab, setActiveTab] = useState(user ? 'editor' : 'viewer');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  if (backendStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-white p-6 text-center space-y-4">
        <AlertCircle size={64} className="text-primary animate-pulse" />
        <h2 className="text-2xl font-bold">Error de Conectividad</h2>
        <p className="text-zinc-500 max-w-xs">
          El servidor Node.js no está respondiendo correctamente (Error 405 o Fallo de Red).
          Esto sucede porque el Proxy (Nginx) está intentando servir las rutas de la API como archivos estáticos.
        </p>
        <div className="bg-surface p-4 rounded-xl text-left border border-outline space-y-2">
           <p className="text-[10px] font-black text-primary uppercase">Solución Requerida:</p>
           <p className="text-[10px] text-zinc-400 font-mono">
             Debes configurar un location /backend-service/ en tu Nginx que haga proxy_pass al puerto 3001.
           </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary px-6 py-2 rounded-xl font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-white">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary"></div>
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
      case 'videos':
        return <VideoListView />;
      case 'login':
        return <LoginView />;
      default:
        return <EditorView />;
    }
  };

  const backgrounds = {
    editor: '/assets/backgrounds/bg-editor.jpg',
    steps: '/assets/backgrounds/bg-steps.jpg',
    viewer: '/assets/backgrounds/bg-viewer.jpg',
    videos: '/assets/backgrounds/bg-videos.jpg',
    login: '/assets/backgrounds/bg-account.jpg'
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 relative">
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgrounds[activeTab] || backgrounds.login})`,
          opacity: 0.6,
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      />

      {/* Content Overlay */}
      <main className="max-w-md mx-auto relative z-10">
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
