import React from 'react';
import { LayoutGrid, PlayCircle, Settings, User, Video } from 'lucide-react';

const Navbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'editor', name: 'Editor', icon: LayoutGrid },
    { id: 'steps', name: 'Mis Pasos', icon: Settings },
    { id: 'viewer', name: 'Visor', icon: PlayCircle },
    { id: 'videos', name: 'Tutoriales', icon: Video },
    { id: 'login', name: 'Cuenta', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-zinc-800 px-6 py-2 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === tab.id ? 'text-primary' : 'text-zinc-500'
          }`}
        >
          <tab.icon size={24} />
          <span className="text-xs mt-1 font-medium">{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
