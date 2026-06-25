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
      tabs.push({ id: 'admin', icon: LayoutGrid, label: 'Panel' });
    } else {
      tabs.push({ id: 'profile', icon: User, label: 'Perfil' });
      tabs.push({ id: 'training', icon: GraduationCap, label: 'Clases' });
    }
  }

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 w-full h-14 md:h-16 bg-surface/95 backdrop-blur-xl border-t md:border-t-0 md:border-b border-white/5 z-50 shadow-xl flex items-center">
      <div className="flex justify-around md:justify-end md:gap-4 items-center w-full max-w-7xl mx-auto px-4">
        <div className="flex-1 hidden md:block">
           <span className="text-primary font-black italic tracking-tighter text-xl">DANCING FLOW</span>
        </div>

        <div className="flex justify-around md:justify-end md:gap-2 flex-1 md:flex-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-4 py-1.5 md:py-2 rounded-xl transition-all duration-200 ${
                    isActive ? 'text-primary md:bg-white/5' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] md:text-sm font-bold uppercase md:capitalize tracking-wider">{tab.label}</span>
                </button>
              );
            })}

            {user && (
              <button
                onClick={handleLogout}
                className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-4 py-1.5 md:py-2 rounded-xl text-zinc-500 hover:text-red-400 transition-all duration-200"
              >
                <LogOut size={18} />
                <span className="text-[10px] md:text-sm font-bold uppercase md:capitalize tracking-wider">Salir</span>
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
