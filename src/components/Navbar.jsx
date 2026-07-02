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
    <nav className="navbar px-4 md:px-12">
      <div className="flex justify-between items-center h-full w-full max-w-[1400px] mx-auto">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => onTabChange('home')}
        >
          <span className="font-sora text-xl md:text-2xl font-extrabold italic text-df-primary tracking-tighter transition-transform group-hover:scale-105">
            DANCING FLOW
          </span>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={18} />
                <span className="hidden md:block">
                  {tab.label}
                </span>

                {/* Active Indicator */}
                {isActive && <div className="nav-link-active-indicator" />}
              </button>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="nav-link hover:!text-red-500"
            >
              <LogOut size={18} />
              <span className="hidden md:block">
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
