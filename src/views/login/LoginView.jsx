import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { LogIn, User as UserIcon, Lock, Key, UserPlus, Sparkles, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import { DFCard, DFButton, DFInput, DFSelect, DFContainer } from '../../components/ui/index';

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
      <DFContainer className="py-24 flex flex-col items-center">
        <DFCard padding="xl" className="w-full max-w-2xl flex flex-col items-center space-y-12 relative overflow-hidden">
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
            <p className="df-label !text-zinc-600">
              {user.role === 'profesor' ? 'DIRECTOR DE ACADEMIA' : 'ESTUDIANTE FLOW'}
            </p>
          </div>

          <DFButton
            variant="secondary"
            onClick={logout}
            className="w-full max-w-xs"
            leftIcon={LogOut}
          >
            Cerrar Sesión
          </DFButton>
        </DFCard>
      </DFContainer>
    );
  }

  return (
    <DFContainer className="py-12 md:py-24 flex justify-center">
      <DFCard padding="xl" className="w-full max-w-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="text-center space-y-6">
          <span className="df-label">Portal de Acceso</span>
          <h2 className="font-sora text-6xl md:text-7xl font-extrabold italic uppercase tracking-tighter text-white leading-none">
            DANCING <span className="text-primary neon-gold">FLOW</span>
          </h2>
          <p className="df-label !text-zinc-600 !text-[10px]">
            {isRegister ? 'Comienza tu viaje hoy mismo' : 'Vuelve a tu zona de entrenamiento'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <DFInput
            label="Nombre de Usuario"
            placeholder="Identificación"
            required
            leftIcon={UserIcon}
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />

          <DFInput
            label="Contraseña Maestra"
            type="password"
            placeholder="Seguridad"
            required
            leftIcon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          {isRegister && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DFSelect
                  label="Género"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  options={[
                    { id: 'unidentified', label: 'Prefiero no decir' },
                    { id: 'male', label: 'Hombre' },
                    { id: 'female', label: 'Mujer' }
                  ]}
                />
                <DFSelect
                  label="Nivel Inicial"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  options={[
                    { id: 'principiante', label: 'Principiante' },
                    { id: 'pre-intermedio', label: 'Pre-Intermedio' },
                    { id: 'intermedio', label: 'Intermedio' },
                    { id: 'avanzado', label: 'Avanzado' }
                  ]}
                />
              </div>

              <DFInput
                label="Token de Acceso"
                placeholder="Token de la Academia"
                required
                leftIcon={Key}
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
              />
            </div>
          )}

          <DFButton
            type="submit"
            fullWidth
            size="xl"
            leftIcon={isRegister ? UserPlus : LogIn}
          >
            {isRegister ? 'UNIRSE AHORA' : 'ENTRAR AL TEMPLO'}
          </DFButton>
        </form>

        <div className="text-center pt-8 border-t border-primary/10">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="df-label !text-zinc-600 hover:!text-primary transition-all py-2"
          >
            {isRegister ? '¿Ya tienes una cuenta? Iniciar Sesión' : '¿Aún no tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </DFCard>
    </DFContainer>
  );
};

export default LoginView;
