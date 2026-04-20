import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  LogIn,
  User as UserIcon,
  LogOut,
  Key,
  Lock,
  UserPlus,
  Shield,
  Ban,
  Play,
  Trash2,
  ShieldCheck,
  UserCheck,
  Palette
} from 'lucide-react';
import Swal from 'sweetalert2';
import { APP_PALETTES } from '../services/constants';

const PalettePicker = () => {
  const { palette, setPalette } = useStore();

  return (
    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-4">
      <div className="flex items-center gap-2">
        <Palette size={18} className="text-secondary" />
        <h3 className="text-sm font-black uppercase tracking-widest">Paleta de Colores</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(APP_PALETTES).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setPalette(p)}
            className={`p-3 rounded-xl border-2 transition-all text-left space-y-2 ${
              palette.name === p.name ? 'border-primary bg-primary/10' : 'border-zinc-800 bg-zinc-950/50'
            }`}
          >
            <span className="text-[10px] font-bold block">{p.name}</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { user, allUsers, fetchUsers, updateUserRoleOrStatus, deleteUserAccount } = useStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatus = async (targetUser, newStatus) => {
    const result = await Swal.fire({
      title: '¿Confirmar cambio?',
      text: `Vas a cambiar el estado de ${targetUser.username} a ${newStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) {
      await updateUserRoleOrStatus(targetUser.id, { status: newStatus });
    }
  };

  const handleRole = async (targetUser, newRole) => {
    const result = await Swal.fire({
      title: '¿Promover/Degradar?',
      text: `Vas a cambiar el rol de ${targetUser.username} a ${newRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fbbf24',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) {
      await updateUserRoleOrStatus(targetUser.id, { role: newRole });
    }
  };

  const handleDelete = async (targetUser) => {
    const result = await Swal.fire({
      title: '¿ELIMINAR CUENTA?',
      text: `Esta acción borrará permanentemente al usuario ${targetUser.username}.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) {
      await deleteUserAccount(targetUser.id);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Shield className="text-primary" size={20} />
        <h3 className="font-black uppercase tracking-widest text-sm">Administración</h3>
      </div>

      <div className="space-y-3">
        {allUsers.filter(u => u.id !== user.id).map(u => (
          <div key={u.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white">{u.username}</h4>
                <p className="text-[10px] uppercase font-black tracking-tighter text-zinc-500">
                  ID: {u.id} • Rol: <span className={u.role === 'student' ? 'text-zinc-400' : 'text-secondary'}>{u.role}</span>
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                u.status === 'paused' ? 'bg-amber-500/10 text-amber-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {u.status}
              </span>
            </div>

            <div className="flex gap-2">
              {u.status === 'active' ? (
                <button onClick={() => handleStatus(u, 'paused')} className="flex-1 bg-zinc-800 p-2 rounded-lg text-amber-500 flex justify-center">
                  <Ban size={16} />
                </button>
              ) : (
                <button onClick={() => handleStatus(u, 'active')} className="flex-1 bg-zinc-800 p-2 rounded-lg text-emerald-500 flex justify-center">
                  <Play size={16} />
                </button>
              )}

              {user.role === 'master' && (
                <>
                  <button
                    onClick={() => handleRole(u, u.role === 'student' ? 'moderator' : 'student')}
                    className="flex-1 bg-zinc-800 p-2 rounded-lg text-secondary flex justify-center"
                  >
                    {u.role === 'student' ? <ShieldCheck size={16} /> : <UserCheck size={16} />}
                  </button>
                  <button onClick={() => handleDelete(u)} className="flex-1 bg-zinc-800 p-2 rounded-lg text-primary flex justify-center">
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {allUsers.length <= 1 && <p className="text-center text-zinc-600 text-xs py-4">No hay otros usuarios.</p>}
      </div>
    </div>
  );
};

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
            {user.role === 'master' ? 'Master de Baile' : user.role === 'moderator' ? 'Moderador' : 'Estudiante'}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-red-500 hover:bg-zinc-800 transition-all active:scale-95"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>

        <PalettePicker />

        {(user.role === 'master' || user.role === 'moderator') && <AdminPanel />}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black">Dancing Flow</h2>
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
