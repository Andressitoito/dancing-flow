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
      });
    }
  };

  if (user) {
    return (
      <div className="py-12 md:py-24 flex flex-col max-w-lg mx-auto px-4">
        <div className="glass-card p-10 md:p-16 flex flex-col items-center space-y-10 relative overflow-hidden border-white/5 bg-white/[0.02] rounded-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

          <div className="relative">
            <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.1)] group hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-[48px] text-primary">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[16px] text-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold italic uppercase tracking-tighter text-white leading-none">{user.username}</h2>
            <p className="label-luxury !text-[9px] !text-zinc-600 uppercase">
              {user.role === 'profesor' ? 'DIRECTOR DE ACADEMIA' : 'ESTUDIANTE FLOW'}
            </p>
          </div>

          <button
            onClick={logout}
            className="btn-secondary w-full max-w-xs flex items-center justify-center gap-3 !h-12 !text-[10px]"
          >
            <span className="material-symbols-outlined !text-[18px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12 md:py-24 px-4">
      <div className="glass-card p-8 md:p-12 space-y-10 relative overflow-hidden border-white/5 bg-white/[0.02] rounded-xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="text-center space-y-4">
          <span className="label-luxury !text-[9px]">Portal de Acceso</span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold italic uppercase tracking-tighter text-white leading-none">
            DANCING <span className="text-primary">FLOW</span>
          </h2>
          <p className="label-luxury !text-zinc-600 !text-[8px]">
            {isRegister ? 'Comienza tu viaje hoy mismo' : 'Vuelve a tu zona de entrenamiento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="label-luxury !text-zinc-600 !text-[8px]">Nombre de Usuario</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 !text-[18px]">person</span>
              <input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="pl-10 h-11 text-sm"
                placeholder="Identificación"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-luxury !text-zinc-600 !text-[8px]">Contraseña Maestra</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 !text-[18px]">lock</span>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pl-10 h-11 text-sm"
                placeholder="Seguridad"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-luxury !text-zinc-600 !text-[8px]">Género</label>
                  <select
                    className="h-11 text-xs"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="unidentified">Prefiero no decir</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="label-luxury !text-zinc-600 !text-[8px]">Nivel Inicial</label>
                  <select
                    className="h-11 text-xs"
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

              <div className="space-y-1.5">
                <label className="label-luxury !text-zinc-600 !text-[8px]">Token de Acceso</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/30 !text-[18px]">key</span>
                  <input
                    required
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    className="pl-10 h-11 text-sm"
                    placeholder="Token de la Academia"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-3 group h-12 !text-[10px]"
          >
            <span className="material-symbols-outlined !text-[20px]">{isRegister ? 'person_add' : 'login'}</span>
            <span>{isRegister ? 'UNIRSE AHORA' : 'ENTRAR AL TEMPLO'}</span>
          </button>
        </form>

        <div className="text-center pt-6 border-t border-white/5">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="label-luxury !text-zinc-600 hover:!text-primary transition-all py-2 !text-[8px]"
          >
            {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
