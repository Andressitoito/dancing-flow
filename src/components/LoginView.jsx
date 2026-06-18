import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut, Palette } from 'lucide-react';
import Swal from 'sweetalert2';
import { APP_PALETTES } from '../services/constants';

const PalettePicker = () => {
  const { palette, setPalette } = useStore();

  return (
    <div className="bg-surface p-4 rounded-3xl border border-outline space-y-4 shadow-xl">
      <div className="flex items-center gap-2 px-2">
        <Palette size={18} className="text-secondary" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paleta de Colores</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(APP_PALETTES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPalette(p)}
            className={`p-3 rounded-2xl border-2 transition-all text-left space-y-2 ${
              palette?.name === p.name ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-outline bg-zinc-950/20'
            }`}
          >
            <span className="text-[9px] font-black block uppercase truncate">{p.name}</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.primary }} />
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.secondary }} />
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.accent }} />
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
      if (onLoginSuccess) onLoginSuccess();
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
      <div className="p-6 flex flex-col space-y-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/50 shadow-2xl shadow-primary/20">
              <UserIcon size={32} className="text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-surface p-1.5 rounded-full border border-outline">
              <Sparkles size={12} className="text-secondary" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight">{user.username}</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
              {user.role === 'master' ? 'Master de Baile' : 'Estudiante'}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-surface border border-outline rounded-2xl font-black uppercase text-[10px] tracking-widest text-primary shadow-lg active:scale-95 transition-all"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
        <PalettePicker />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-primary drop-shadow-md">DANCING FLOW</h2>
        <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">
          {isRegister ? 'Registro de Alumno' : 'BIENVENIDO'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Usuario</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-surface border border-outline rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all"
              placeholder="Ingresa tu usuario"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-surface border border-outline rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {isRegister && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Género</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-surface border border-outline rounded-2xl py-3 px-4 text-xs outline-none focus:border-primary"
                >
                  <option value="unidentified">No identificado</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Nivel</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full bg-surface border border-outline rounded-2xl py-3 px-4 text-xs outline-none focus:border-primary"
                >
                  <option value="principiante">Principiante</option>
                  <option value="pre-intermedio">Pre-Intermedio</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2">Token de Acceso</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  required
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  className="w-full bg-surface border border-outline rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all"
                  placeholder="Token"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-background py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
        >
          {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
          {isRegister ? 'REGISTRARME' : 'INICIAR SESIÓN'}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
        >
          {isRegister ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
