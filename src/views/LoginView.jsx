import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { DFCard, DFButton, DFInput, DFSelect } from '../components/ui';

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
        background: '#0A1828',
        color: '#D4AF37',
        customClass: {
            popup: 'df-card !border-df-primary/40',
            confirmButton: 'df-button df-button-primary'
        }
      });
    }
  };

  if (user) {
    return (
      <div className="py-12 flex flex-col items-center">
        <DFCard className="w-full max-w-xl p-16 flex flex-col items-center space-y-12 relative bg-df-surface-1 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-df-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="w-32 h-32 bg-df-bg rounded-full flex items-center justify-center border-2 border-df-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.2)] group hover:scale-105 transition-all duration-500">
              <UserIcon size={56} className="text-df-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-df-primary p-3 rounded-2xl border-4 border-df-surface-1 shadow-xl">
              <Sparkles size={20} className="text-black" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="df-display text-4xl text-df-text uppercase tracking-tighter leading-none">{user.username}</h2>
            <p className="df-label text-df-text-muted">
              {user.role === 'profesor' ? 'DIRECTOR DE ACADEMIA' : 'ESTUDIANTE FLOW'}
            </p>
          </div>

          <DFButton
            onClick={logout}
            variant="secondary"
            size="lg"
            className="w-full max-w-xs"
            leftIcon={LogOut}
          >
            Cerrar Sesión
          </DFButton>
        </DFCard>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 md:py-16">
      <DFCard className="p-10 md:p-16 space-y-12 relative bg-df-surface-1 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-df-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center space-y-5">
          <span className="df-label text-df-primary">Portal de Acceso</span>
          <h2 className="df-display text-5xl md:text-6xl text-df-text uppercase tracking-tighter leading-none">
            DANCING <span className="text-df-primary shadow-2xl">FLOW</span>
          </h2>
          <p className="df-caption italic">
            {isRegister ? 'Comienza tu viaje hacia la maestría artística.' : 'Vuelve a tu zona de entrenamiento personal.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <DFInput
            label="Identificación"
            required
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            leftIcon={UserIcon}
            placeholder="Usuario"
          />

          <DFInput
            label="Seguridad"
            required
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            leftIcon={Lock}
            placeholder="••••••••"
          />

          {isRegister && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DFSelect
                  label="Género"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="unidentified">Prefiero no decir</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </DFSelect>
                <DFSelect
                  label="Nivel Inicial"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  <option value="principiante">Principiante</option>
                  <option value="pre-intermedio">Pre-Intermedio</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </DFSelect>
              </div>

              <DFInput
                label="Token de Academia"
                required
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                leftIcon={Key}
                placeholder="Token de acceso"
              />
            </div>
          )}

          <DFButton
            type="submit"
            fullWidth
            size="xl"
            className="shadow-xl"
            leftIcon={isRegister ? UserPlus : LogIn}
          >
            {isRegister ? 'UNIRSE AHORA' : 'ENTRAR AL TEMPLO'}
          </DFButton>
        </form>

        <div className="text-center pt-8 border-t border-df-border-subtle">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="df-label !text-[9px] text-df-text-muted hover:text-df-primary transition-all cursor-pointer py-2"
          >
            {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </DFCard>
    </div>
  );
};

export default LoginView;
