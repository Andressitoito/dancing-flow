import React from 'react';
import { LayoutGrid, PlayCircle, Settings, User, Video, ShieldCheck } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user } = useStore();

  const isPrivileged = user?.role === 'master' || user?.role === 'moderator';

  const tabs = [
    { id: 'viewer', name: 'Visor', icon: PlayCircle },
    { id: 'videos', name: 'Clases', icon: Video },
    ...(user ? [{ id: 'editor', name: 'Editor', icon: LayoutGrid }] : []),
    ...(isPrivileged ? [{ id: 'steps', name: 'Mis Pasos', icon: Settings }] : []),
    { id: 'login', name: 'Cuenta', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-outline/60 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center min-w-[64px] p-2 rounded-2xl transition-all duration-300 ${
            activeTab === tab.id ? 'text-primary bg-primary/5 scale-105' : 'text-zinc-500'
          }`}
        >
          <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[9px] mt-1.5 font-black uppercase tracking-widest">{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
