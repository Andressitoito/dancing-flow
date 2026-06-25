import React from 'react';
import { Home, User, GraduationCap, LayoutGrid, LogIn, Users, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    onTabChange('home');
  };

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
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 w-full h-[72px] md:h-[80px] bg-surface/90 backdrop-blur-2xl border-t md:border-t-0 md:border-b border-white/5 z-50 shadow-2xl flex items-center">
      <div className="flex justify-around md:justify-center md:gap-16 items-center w-full max-w-7xl mx-auto px-6">
        <div className="flex-1 hidden md:block">
           <span className="text-primary font-black italic tracking-tighter text-2xl uppercase">DANCING FLOW</span>
        </div>

        <div className="flex justify-around md:justify-center md:gap-8 flex-1 md:flex-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${
                    isActive
                    ? 'bg-primary/15 text-primary md:bg-primary md:text-background shadow-xl scale-105'
                    : 'text-zinc-500 hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">{tab.label}</span>
                </button>
              );
            })}

            {user && (
              <button
                onClick={handleLogout}
                className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 px-6 py-3 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500"
              >
                <LogOut size={22} />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Salir</span>
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
