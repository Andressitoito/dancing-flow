import React from 'react';
import useStore from '../store/useStore';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    onTabChange('home');
  };

  const tabs = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'about', icon: 'groups', label: 'Nosotros' },
  ];

  if (!user) {
    tabs.push({ id: 'login', icon: 'login', label: 'Entrar' });
  } else {
    if (user.role === 'profesor') {
      tabs.push({ id: 'admin', icon: 'dashboard', label: 'Panel' });
    } else {
      tabs.push({ id: 'profile', icon: 'person', label: 'Mi Perfil' });
      tabs.push({ id: 'training', icon: 'school', label: 'Clases' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 w-full h-[56px] smoked-gold-glass z-50 flex items-center border-b border-white/5">
      <div className="max-container flex justify-between items-center px-4 md:px-8">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => onTabChange('home')}
        >
          <span className="font-sora text-lg md:text-xl font-extrabold italic text-primary tracking-tighter transition-transform group-hover:scale-105">
            DANCING FLOW
          </span>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center gap-1 md:gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 group ${
                  isActive ? 'text-primary' : 'text-df-text-dim hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined !text-[18px]">
                  {tab.icon}
                </span>
                <span className={`hidden md:block label-luxury !tracking-[0.15em] transition-colors ${
                  isActive ? '!text-primary' : '!text-df-text-dim group-hover:!text-white'
                }`}>
                  {tab.label}
                </span>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute -bottom-[18px] left-0 w-full h-[1px] bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                )}
              </button>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-df-text-dim hover:text-red-400 transition-colors ml-2"
            >
              <span className="material-symbols-outlined !text-[18px]">
                logout
              </span>
              <span className="hidden md:block label-luxury !tracking-[0.15em] !text-inherit">
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
