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
    <nav className="fixed bottom-6 md:top-6 md:bottom-auto left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-surface-glass backdrop-blur-2xl border border-outline rounded-3xl p-2 z-50 shadow-2xl flex justify-around items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
              isActive ? 'bg-primary text-background scale-110 shadow-lg' : 'text-zinc-500 hover:text-primary'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[10px] font-bold mt-1 uppercase">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;
