import React from 'react';
import { Home, User, GraduationCap, LayoutGrid, LogIn, Users } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user } = useStore();

  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'about', icon: Users, label: 'Nosotros' },
  ];

  if (!user) {
    tabs.push({ id: 'login', icon: LogIn, label: 'Entrar' });
  } else {
    if (user.role === 'profesor') {
      tabs.push({ id: 'admin', icon: LayoutGrid, label: 'Profesor' });
    } else {
      tabs.push({ id: 'profile', icon: User, label: 'Mi Perfil' });
      tabs.push({ id: 'training', icon: GraduationCap, label: 'Clases' });
    }
  }

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 w-full bg-surface/90 backdrop-blur-xl border-t md:border-t-0 md:border-b border-white/5 p-2 z-50 shadow-2xl flex justify-around md:justify-center md:gap-12 items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 px-4 py-2 md:py-3 rounded-2xl transition-all duration-300 ${
              isActive ? 'bg-primary/10 text-primary md:bg-primary md:text-background shadow-lg' : 'text-zinc-500 hover:text-primary hover:bg-white/5'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;
