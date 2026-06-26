import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut, Check } from 'lucide-react';
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
        background: '#051424',
        color: '#D4AF37',
        customClass: {
            popup: 'glass-card border-primary/40',
            confirmButton: 'btn-primary'
        }
      });
    }
  };

  if (user) {
    return (
      <div className="py-24 flex flex-col max-w-2xl mx-auto">
        <div className="glass-card p-16 flex flex-col items-center space-y-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

          <div className="relative">
            <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-2 border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] group hover:scale-105 transition-transform duration-500">
              <UserIcon size={56} className="text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-full border-4 border-black shadow-lg">
              <Sparkles size={20} className="text-black" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="font-sora text-5xl font-extrabold italic uppercase tracking-tighter text-white leading-none">{user.username}</h2>
            <p className="label-luxury !text-zinc-600">
              {user.role === 'profesor' ? 'DIRECTOR DE ACADEMIA' : 'ESTUDIANTE FLOW'}
            </p>
          </div>

          <button
            onClick={logout}
            className="btn-secondary w-full max-w-xs flex items-center justify-center gap-4"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 md:py-24">
      <div className="glass-card p-10 md:p-16 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="text-center space-y-6">
          <span className="label-luxury">Portal de Acceso</span>
          <h2 className="font-sora text-6xl md:text-7xl font-extrabold italic uppercase tracking-tighter text-white leading-none">
            DANCING <span className="text-primary neon-gold">FLOW</span>
          </h2>
          <p className="label-luxury !text-zinc-600 !text-[10px]">
            {isRegister ? 'Comienza tu viaje hoy mismo' : 'Vuelve a tu zona de entrenamiento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="label-luxury !text-zinc-500 !text-[10px]">Nombre de Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
              <input
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="pl-8"
                placeholder="Identificación"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="label-luxury !text-zinc-500 !text-[10px]">Contraseña Maestra</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pl-8"
                placeholder="Seguridad"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="label-luxury !text-zinc-500 !text-[10px]">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="unidentified">Prefiero no decir</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="label-luxury !text-zinc-500 !text-[10px]">Nivel Inicial</label>
                  <select
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

              <div className="space-y-3">
                <label className="label-luxury !text-zinc-500 !text-[10px]">Token de Acceso</label>
                <div className="relative">
                  <Key className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                  <input
                    required
                    value={formData.token}
                    onChange={(e) => setFormData({...formData, token: e.target.value})}
                    className="pl-8"
                    placeholder="Token de la Academia"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-4 group h-16"
          >
            {isRegister ? <UserPlus size={24} /> : <LogIn size={24} />}
            <span>{isRegister ? 'UNIRSE AHORA' : 'ENTRAR AL TEMPLO'}</span>
          </button>
        </form>

        <div className="text-center pt-8 border-t border-primary/10">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="label-luxury !text-zinc-600 hover:!text-primary transition-all py-2"
          >
            {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
