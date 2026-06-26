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
      tabs.push({ id: 'profile', icon: User, label: 'Mi Perfil' });
      tabs.push({ id: 'training', icon: GraduationCap, label: 'Clases' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[64px] md:h-[80px] smoked-gold-glass z-50 flex items-center px-4 md:px-12">
      <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => onTabChange('home')}
        >
          <span className="font-sora text-xl md:text-2xl font-extrabold italic text-primary tracking-tighter neon-gold transition-transform group-hover:scale-105">
            DANCING FLOW
          </span>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center gap-2 md:gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-md transition-all duration-300 group ${
                  isActive ? 'text-primary' : 'text-df-text-dim hover:text-primary'
                }`}
              >
                <Icon size={18} className="md:w-5 md:h-5" />
                <span className="hidden md:block label-luxury !text-[10px] !tracking-[0.2em]">
                  {tab.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                )}
              </button>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-df-text-dim hover:text-red-500 transition-colors"
            >
              <LogOut size={18} className="md:w-5 md:h-5" />
              <span className="hidden md:block label-luxury !text-[10px] !tracking-[0.2em] !color-inherit">
                Salir
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
