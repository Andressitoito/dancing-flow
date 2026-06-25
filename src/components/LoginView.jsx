import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut, Palette, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { APP_PALETTES } from '../services/constants';

const PalettePicker = () => {
  const { palette, setPalette } = useStore();

  return (
    <div className="bg-surface-glass/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl mt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex items-center gap-4 px-2">
        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
            <Palette size={24} />
        </div>
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Personalización</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(APP_PALETTES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPalette(p)}
            className={`p-6 rounded-[2rem] border-2 transition-all duration-500 text-left flex items-center justify-between group ${
              palette?.name === p.name
              ? 'border-primary bg-primary/15 shadow-2xl shadow-primary/10 scale-[1.02]'
              : 'border-white/5 bg-black/40 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
                <div className="flex gap-1.5 p-2 bg-black/50 rounded-full border border-white/10">
                  <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: p.primary }} />
                  <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: p.secondary }} />
                </div>
                <span className={`text-sm font-black uppercase tracking-widest ${palette?.name === p.name ? 'text-primary' : 'text-zinc-500 group-hover:text-white'}`}>{p.name}</span>
            </div>
            {palette?.name === p.name && <Check size={20} className="text-primary" strokeWidth={4} />}
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
        title: 'Error de Acceso',
        text: result.error,
        icon: 'error',
        background: '#18181b',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl bg-surface-glass/90' }
      });
    }
  };

  if (user) {
    return (
      <div className="py-12 flex flex-col max-w-2xl mx-auto space-y-12">
        <div className="flex flex-col items-center space-y-10 py-16 bg-surface-glass/20 backdrop-blur-3xl rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] z-0" />

          <div className="relative z-10">
            <div className="w-32 h-32 bg-black/60 rounded-[2.5rem] flex items-center justify-center border-2 border-primary/40 shadow-2xl shadow-primary/20 group hover:scale-110 transition-transform duration-700">
              <UserIcon size={56} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-3xl border border-black shadow-2xl">
              <Sparkles size={24} className="text-background" />
            </div>
          </div>

          <div className="text-center space-y-4 z-10 px-8">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">{user.username}</h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs opacity-60">
              {user.role === 'profesor' ? 'DIRECTOR DE ACADEMIA' : 'ESTUDIANTE FLOW'}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-4 px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] text-primary hover:bg-primary hover:text-background transition-all duration-500 shadow-2xl group z-10 active:scale-95"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
        <PalettePicker />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="bg-surface-glass/40 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="text-center space-y-6">
          <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Portal de Acceso</p>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-none">DANCING <span className="text-primary">FLOW</span></h2>
          <p className="text-zinc-500 font-black uppercase text-xs tracking-[0.4em] max-w-xs mx-auto opacity-60">
            {isRegister ? 'Comienza tu viaje hoy mismo' : 'Vuelve a tu zona de entrenamiento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-8">Nombre de Usuario</label>
            <div className="relative group">
              <UserIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={24} />
              <input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-black/60 border border-white/5 rounded-[2.5rem] py-6 pl-20 pr-10 text-xl outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-zinc-800"
                placeholder="Identificación"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-8">Contraseña Maestra</label>
            <div className="relative group">
              <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={24} />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/60 border border-white/5 rounded-[2.5rem] py-6 pl-20 pr-10 text-xl outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-zinc-800"
                placeholder="Seguridad"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-8">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-black/60 border border-white/5 rounded-[2.5rem] py-6 px-10 text-lg outline-none focus:border-primary/50 shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="unidentified">Prefiero no decir</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-8">Nivel Inicial</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-black/60 border border-white/5 rounded-[2.5rem] py-6 px-10 text-lg outline-none focus:border-primary/50 shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="pre-intermedio">Pre-Intermedio</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-8">Token de Acceso</label>
                <div className="relative group">
                  <Key className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={24} />
                  <input
                    required
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    className="w-full bg-black/60 border border-white/5 rounded-[2.5rem] py-6 pl-20 pr-10 text-xl outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-zinc-800"
                    placeholder="Token de la Academia"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-background py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all mt-6 flex items-center justify-center gap-4 group"
          >
            {isRegister ? <UserPlus size={24} strokeWidth={3} /> : <LogIn size={24} strokeWidth={3} />}
            <span className="group-hover:translate-x-1 transition-transform">{isRegister ? 'UNIRSE AHORA' : 'ENTRAR AL TEMPLO'}</span>
          </button>
        </form>

        <div className="text-center pt-8">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] hover:text-primary transition-all py-4 border-b border-white/5 hover:border-primary/50"
          >
            {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
