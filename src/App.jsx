import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import useStore from './store/useStore';
import MyStepsView from './components/MyStepsView';
import EditorView from './components/EditorView';
import ChoreoViewerView from './components/ChoreoViewerView';
import LoginView from './components/LoginView';

import { AlertCircle } from 'lucide-react';

function App() {
  const { user, fetchInitialData, loading, stopPlayback, backendStatus } = useStore();
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

  if (backendStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-white p-6 text-center space-y-4">
        <AlertCircle size={64} className="text-primary animate-pulse" />
        <h2 className="text-2xl font-bold">Error de Conectividad</h2>
        <p className="text-zinc-500 max-w-xs">
          El servidor Node.js no está respondiendo correctamente (Error 405 o Fallo de Red).
          Esto sucede porque el Proxy (Nginx) está intentando servir las rutas de la API como archivos estáticos.
        </p>
        <div className="bg-zinc-900 p-4 rounded-xl text-left border border-zinc-800 space-y-2">
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
