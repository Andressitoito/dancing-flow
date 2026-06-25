import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut, Palette } from 'lucide-react';
import Swal from 'sweetalert2';
import { APP_PALETTES } from '../services/constants';

const PalettePicker = () => {
  const { palette, setPalette } = useStore();

  return (
    <div className="bg-surface p-8 rounded-[2rem] border border-outline space-y-6 shadow-xl">
      <div className="flex items-center gap-3 px-2">
        <Palette size={24} className="text-secondary" />
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Paleta de Colores</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(APP_PALETTES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPalette(p)}
            className={`p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
              palette?.name === p.name ? 'border-primary bg-primary/10 shadow-lg' : 'border-outline bg-zinc-950/20'
            }`}
          >
            <span className="text-sm font-black uppercase">{p.name}</span>
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: p.primary }} />
              <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: p.secondary }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LoginView = ({ onLoginSuccess }) => {
  const { user, login, signup, logout } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    token: '',
    gender: 'unidentified',
    level: 'principiante'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister
      ? await signup(formData)
      : await login(formData.username, formData.password);

    if (result.success) {
      if (onLoginSuccess) {
        const { user: loggedInUser } = useStore.getState();
        onLoginSuccess(loggedInUser);
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: result.error,
        icon: 'error',
        background: '#18181b',
        color: '#fff'
      });
    }
  };

  if (user) {
    return (
      <div className="p-8 flex flex-col space-y-8 max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-6 py-8 bg-surface rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/50 shadow-2xl shadow-primary/20">
              <UserIcon size={40} className="text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-surface p-2 rounded-full border border-outline shadow-lg">
              <Sparkles size={16} className="text-secondary" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tight">{user.username}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">
              {user.role === 'profesor' ? 'Profesor de Baile' : 'Alumno en Formación'}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-800 border border-white/5 rounded-2xl font-black uppercase text-xs tracking-widest text-primary hover:bg-zinc-700 transition-all shadow-lg active:scale-95"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
        <PalettePicker />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto bg-surface rounded-[3rem] border border-white/5 shadow-2xl mt-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-primary drop-shadow-lg">DANCING FLOW</h2>
        <p className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em]">
          {isRegister ? 'Registro de Alumno' : 'BIENVENIDO AL PORTAL'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-zinc-500 uppercase ml-4">Nombre de Usuario</label>
          <div className="relative">
            <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-background border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-base outline-none focus:border-primary transition-all shadow-inner"
              placeholder="Tu usuario"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-zinc-500 uppercase ml-4">Contraseña Maestra</label>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-background border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-base outline-none focus:border-primary transition-all shadow-inner"
              placeholder="••••••••"
            />
          </div>
        </div>

        {isRegister && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase ml-4">Género</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-[1.5rem] py-4 px-6 text-base outline-none focus:border-primary shadow-inner"
                >
                  <option value="unidentified">Prefiero no decir</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase ml-4">Nivel Inicial</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-[1.5rem] py-4 px-6 text-base outline-none focus:border-primary shadow-inner"
                >
                  <option value="principiante">Principiante</option>
                  <option value="pre-intermedio">Pre-Intermedio</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase ml-4">Token de Seguridad</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                <input
                  required
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  className="w-full bg-background border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-base outline-none focus:border-primary transition-all shadow-inner"
                  placeholder="Introduce el token de la academia"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-background py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-3"
        >
          {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
          {isRegister ? 'CREAR MI CUENTA' : 'ACCEDER AL PORTAL'}
        </button>
      </form>

      <div className="text-center pt-4">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors py-2"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta aún? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
