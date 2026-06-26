import React, { useState } from 'react';
import useStore from '../store/useStore';
import Swal from 'sweetalert2';

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
        background: '#0f0f0f',
        color: '#ffffff',
        confirmButtonColor: '#D4AF37'
      });
    }
  };

  if (user) {
    return (
      <div className="py-20 md:py-32 flex flex-col max-w-2xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-surface-container p-12 md:p-20 flex flex-col items-center space-y-12 relative overflow-hidden border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

          <div className="relative group">
            <div className="w-32 h-32 bg-black rounded-[2rem] flex items-center justify-center border-2 border-primary/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-black">
              <span className="material-symbols-outlined !text-[64px] text-primary group-hover:scale-110 transition-transform duration-500">account_circle</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary w-10 h-10 rounded-xl border-4 border-black flex items-center justify-center shadow-xl kinetic-skew">
              <span className="material-symbols-outlined !text-[20px] text-black font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <span className="font-sora text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">Sesión Activa</span>
            <h2 className="font-sora text-[40px] md:text-[60px] font-extrabold italic uppercase tracking-tighter text-white leading-none">{user.username}</h2>
            <div className="inline-flex bg-primary text-black px-4 py-1 rounded italic font-black text-[10px] uppercase tracking-tighter kinetic-skew">
              {user.role === 'profesor' ? 'MASTER MENTOR' : 'ACADEMY MEMBER'}
            </div>
          </div>

          <button
            onClick={logout}
            className="group btn-secondary w-full max-w-sm flex items-center justify-center gap-4 !h-14 !text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-500 shadow-xl"
          >
            <span className="material-symbols-outlined !text-[22px] group-hover:-translate-x-1 transition-transform">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 md:py-32 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-surface-container p-10 md:p-16 space-y-12 relative overflow-hidden border border-white/10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />

        <div className="text-center space-y-6">
          <span className="font-sora text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">Membership Login</span>
          <h2 className="font-sora text-[48px] md:text-[72px] font-black italic uppercase tracking-tighter text-white leading-[0.85]">
            DANCING <br /> <span className="text-primary">FLOW</span>
          </h2>
          <p className="font-sora text-zinc-500 text-sm font-light uppercase tracking-widest max-w-xs mx-auto">
            {isRegister ? 'Inicia tu formación técnica de élite' : 'Accede a tu zona de perfeccionamiento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
          <div className="space-y-2">
            <label className="font-sora text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-4">Identidad</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors !text-[22px]">person</span>
              <input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-14 h-16 text-base bg-black/40 border-white/10 rounded-2xl focus:border-primary/50 transition-all italic font-bold placeholder:text-zinc-800"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-sora text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-4">Contraseña</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors !text-[22px]">lock</span>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-14 h-16 text-base bg-black/40 border-white/10 rounded-2xl focus:border-primary/50 transition-all italic font-bold placeholder:text-zinc-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-sora text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-4">Género</label>
                  <select
                    className="w-full h-16 text-sm bg-black/40 border-white/10 rounded-2xl focus:border-primary/50 transition-all px-6 font-bold uppercase"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="unidentified">No especificado</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-sora text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-4">Nivel Base</label>
                  <select
                    className="w-full h-16 text-sm bg-black/40 border-white/10 rounded-2xl focus:border-primary/50 transition-all px-6 font-bold uppercase"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="principiante">Principiante</option>
                    <option value="pre-intermedio">Pre-Intermedio</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sora text-[10px] font-black text-zinc-600 tracking-widest uppercase ml-4">Token Academy</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-primary transition-colors !text-[22px]">key</span>
                  <input
                    required
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    className="w-full pl-14 h-16 text-base bg-black/40 border-white/10 rounded-2xl focus:border-primary/50 transition-all italic font-bold placeholder:text-zinc-800"
                    placeholder="Acceso exclusivo"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="group btn-primary w-full flex items-center justify-center gap-4 h-16 !text-[12px] font-black uppercase tracking-[0.3em] kinetic-skew shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 duration-500"
          >
            <span className="material-symbols-outlined !text-[24px] transition-transform group-hover:rotate-12 group-hover:scale-110">{isRegister ? 'person_add' : 'bolt'}</span>
            <span>{isRegister ? 'INICIAR VIAJE' : 'ENTRAR AL TEMPLO'}</span>
          </button>
        </form>

        <div className="text-center pt-10 border-t border-white/10">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-sora text-[10px] font-black text-zinc-500 hover:text-primary uppercase tracking-[0.2em] transition-all duration-300 italic"
          >
            {isRegister ? '¿Ya eres miembro? Iniciar Sesión' : '¿Aún no tienes acceso? Solicitar membresía'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
