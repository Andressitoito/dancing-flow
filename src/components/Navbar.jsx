import React from 'react';
import { Home, User, GraduationCap, LayoutGrid, LogIn, Users, LogOut } from 'lucide-react';
import useStore from '../store/useStore';
import { DFContainer } from './ui';

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
      tabs.push({ id: 'profile', icon: User, label: 'Mi Perfil' });
      tabs.push({ id: 'training', icon: GraduationCap, label: 'Clases' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[64px] bg-df-bg/80 backdrop-blur-2xl border-b border-df-border-subtle z-50 flex items-center">
      <DFContainer className="flex justify-between items-center w-full">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => onTabChange('home')}
        >
          <span className="df-display text-lg md:text-xl text-df-primary tracking-tighter transition-transform group-hover:scale-105">
            DANCING FLOW
          </span>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all duration-300 group cursor-pointer ${
                  isActive ? 'text-df-primary bg-df-primary/5' : 'text-df-text-muted hover:text-df-primary'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:block df-nav !text-[10px]">
                  {tab.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-df-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                )}
              </button>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-df-text-muted hover:text-df-danger transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span className="hidden md:block df-nav !text-[10px]">
                Salir
              </span>
            </button>
          )}
        </div>
      </DFContainer>
    </nav>
  );
};

export default Navbar;
