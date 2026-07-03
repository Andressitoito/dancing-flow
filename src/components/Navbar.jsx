import React from 'react';
import useStore from '../store/useStore';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ activeTab, onTabChange }) => {
  const { user, logout } = useStore();

  const navLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Academia' },
  ];

  if (user) {
    if (user.role === 'profesor') {
      navLinks.push({ id: 'admin', label: 'Panel Profesor' });
    } else {
      navLinks.push({ id: 'training', label: 'Mi Entrenamiento' });
      navLinks.push({ id: 'profile', label: 'Mi Perfil' });
    }
  }

  return (
    <nav className="fixed top-0 w-full h-[56px] z-50 bg-background/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-6 md:px-16">
      <div className="flex items-center gap-8">
        <span
          className="font-sora text-xl font-extrabold italic text-primary tracking-tighter cursor-pointer"
          onClick={() => onTabChange('home')}
        >
          Dancing Flow
        </span>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`font-sora text-[12px] font-bold uppercase tracking-widest transition-all ${
                activeTab === link.id
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-1 rounded bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon size={14} className="text-primary" />
              </div>
              <span className="font-sora text-[10px] font-bold uppercase tracking-widest text-on-surface">
                {user.username}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                onTabChange('home');
              }}
              className="font-sora text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary flex items-center gap-2 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onTabChange('login')}
            className="font-sora text-[11px] px-6 py-2 rounded bg-primary text-black font-bold uppercase tracking-widest hover:scale-95 active:scale-90 transition-all active-glow"
          >
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
