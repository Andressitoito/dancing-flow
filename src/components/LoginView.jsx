import React, { useState } from 'react';
import useStore from '../store/useStore';
import { LogIn, User as UserIcon, LogOut, Key, Lock, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';

const LoginView = () => {
  const { user, login, register, logout } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    token: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData.username, formData.password, formData.token);
        Swal.fire({
          title: 'Cuenta Creada',
          text: 'Ya puedes empezar a crear tus coreografías.',
          icon: 'success',
          background: '#18181b', color: '#fff'
        });
      } else {
        await login(formData.username, formData.password);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        background: '#18181b', color: '#fff'
      });
    }
  };

  if (user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
          <UserIcon size={48} className="text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black">{user.username}</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">
            {user.isAdmin ? 'Administrador' : 'Estudiante'}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-red-500 hover:bg-zinc-800 transition-all active:scale-95"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black">BachataFlow</h2>
        <p className="text-zinc-500 font-medium">
          {isRegister ? 'Crea tu cuenta de estudiante' : 'Inicia sesión para guardar tus coreos'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Usuario</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all"
              placeholder="Ej. Andresito"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {isRegister && (
          <div className="space-y-1 animate-in slide-in-from-top-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Token de Registro</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                required
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all"
                placeholder="Token de la Pi"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
        >
          {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
          {isRegister ? 'Registrarme' : 'Entrar'}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-zinc-500 text-xs font-bold hover:text-white transition-colors"
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
