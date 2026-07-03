import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Eye, EyeOff, User, Lock, Mail, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const LoginView = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    token: '',
    gender: 'otro',
    level: 'principiante'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isLogin) {
      res = await login(formData.username, formData.password);
    } else {
      res = await signup(formData);
    }

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: isLogin ? '¡Bienvenido de nuevo!' : '¡Cuenta creada!',
        text: 'Redirigiendo...',
        timer: 1500,
        showConfirmButton: false,
        background: '#051424',
        color: '#fff'
      });
      onLoginSuccess(useStore.getState().user);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.error,
        background: '#051424',
        color: '#fff'
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full glass-card p-10 rounded-2xl border border-primary/10 shadow-2xl relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl font-black italic text-on-surface uppercase tracking-tighter mb-2">
              {isLogin ? 'Ingresar al' : 'Crear Cuenta'} <span className="text-primary">Templo</span>
            </h2>
            <p className="font-sora text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              {isLogin ? 'Continúa tu camino a la maestría' : 'Inicia tu evolución hoy mismo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-sora text-[10px] text-primary uppercase tracking-widest font-bold ml-1">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Tu identidad"
                  className="w-full bg-background/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-sora text-[10px] text-primary uppercase tracking-widest font-bold ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-sora text-[10px] text-primary uppercase tracking-widest font-bold ml-1">Género</label>
                    <select
                      className="w-full bg-background/50 border border-white/5 rounded-xl py-4 px-4 text-on-surface focus:border-primary/50 focus:ring-0 transition-all font-inter appearance-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sora text-[10px] text-primary uppercase tracking-widest font-bold ml-1">Nivel</label>
                    <select
                      className="w-full bg-background/50 border border-white/5 rounded-xl py-4 px-4 text-on-surface focus:border-primary/50 focus:ring-0 transition-all font-inter appearance-none"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sora text-[10px] text-primary uppercase tracking-widest font-bold ml-1">Token de Inscripción (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Para roles especiales"
                    className="w-full bg-background/50 border border-white/5 rounded-xl py-4 px-4 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-black font-sora font-black py-5 rounded-xl uppercase tracking-[0.2em] italic hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl active-glow flex items-center justify-center gap-2 mt-4"
            >
              {isLogin ? 'Ingresar' : 'Registrarse'}
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="font-sora text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-4">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya eres parte de la academia?'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-sora text-xs text-primary font-black uppercase tracking-[0.2em] italic hover:underline"
            >
              {isLogin ? 'Crear Cuenta Ahora' : 'Inicia Sesión Aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
