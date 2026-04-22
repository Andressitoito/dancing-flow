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
  Palette,
  Search,
  X,
  Sparkles
} from 'lucide-react';
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
              palette.name === p.name ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-outline bg-zinc-950/20'
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

const AdminPanel = () => {
  const { user, allUsers, fetchUsers, updateUserRoleOrStatus, deleteUserAccount } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatus = async (targetUser, newStatus) => {
    const result = await Swal.fire({
      title: '¿Confirmar?',
      text: `Estado a ${newStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) await updateUserRoleOrStatus(targetUser.id, { status: newStatus });
  };

  const handleRole = async (targetUser, newRole) => {
    const result = await Swal.fire({
      title: '¿Rol?',
      text: `Rol a ${newRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fbbf24',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) await updateUserRoleOrStatus(targetUser.id, { role: newRole });
  };

  const handleDelete = async (targetUser) => {
    const result = await Swal.fire({
      title: 'ELIMINAR?',
      text: `Se borrará la cuenta de ${targetUser.username} y sus pasos.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#18181b', color: '#fff'
    });
    if (result.isConfirmed) await deleteUserAccount(targetUser.id);
  };

  const filteredUsers = allUsers.filter(u =>
    u.id !== user.id &&
    (u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="mt-8 pt-8 border-t border-outline space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Shield className="text-primary" size={20} />
          <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-400">Administración</h3>
        </div>
        {user.role === 'master' && (
          <button
            onClick={async () => {
              const res = await fetch('/backend-service/admin/cleanup-choreos?adminId=' + user.id, { method: 'DELETE' });
              const data = await res.json();
              Swal.fire({ title: 'Limpieza', text: `${data.deleted} coreos huérfanas borradas.`, icon: 'success', background: '#18181b', color: '#fff' });
            }}
            className="text-[9px] font-black text-primary uppercase border border-primary/30 px-2 py-1 rounded-lg"
          >
            Limpiar Huérfanas
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="w-full bg-surface border border-outline rounded-2xl py-2.5 pl-12 pr-4 text-xs outline-none focus:border-primary transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredUsers.map(u => (
          <div key={u.id} className="bg-surface p-3 rounded-2xl border border-outline flex items-center justify-between gap-4">
            <div className="flex-1 truncate">
              <h4 className="font-bold text-white text-xs truncate">
                {u.username} <span className="text-[10px] text-zinc-500 font-medium">({u.firstName} {u.lastName})</span>
              </h4>
              <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500">
                <span className={u.role === 'student' ? 'text-zinc-500' : 'text-secondary'}>{u.role}</span> • {u.status}
              </p>
            </div>

            <div className="flex gap-1.5 shrink-0">
              {u.status === 'active' ? (
                <button onClick={() => handleStatus(u, 'paused')} className="p-2 rounded-xl bg-zinc-950/30 text-zinc-500 hover:text-secondary">
                  <Ban size={14} />
                </button>
              ) : (
                <button onClick={() => handleStatus(u, 'active')} className="p-2 rounded-xl bg-accent/10 text-accent">
                  <Play size={14} />
                </button>
              )}

              {user.role === 'master' && (
                <>
                  <button
                    onClick={() => handleRole(u, u.role === 'student' ? 'moderator' : 'student')}
                    className="p-2 rounded-xl bg-zinc-950/30 text-zinc-500 hover:text-secondary"
                  >
                    {u.role === 'student' ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                  </button>
                  <button onClick={() => handleDelete(u)} className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && <p className="text-center text-zinc-600 text-[10px] py-4 uppercase font-black tracking-widest">Sin usuarios.</p>}
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
    token: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (formData.password.length < 8) throw new Error('Mínimo 8 caracteres');
        await register(formData.username, formData.password, formData.token, formData.firstName, formData.lastName);
        Swal.fire({ title: 'Bienvenido', icon: 'success', background: '#18181b', color: '#fff' });
      } else {
        await login(formData.username, formData.password);
      }
    } catch (error) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', background: '#18181b', color: '#fff' });
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
              {user.role === 'master' ? 'Master de Baile' : user.role === 'moderator' ? 'Moderador' : 'Estudiante'}
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

        {(user.role === 'master' || user.role === 'moderator') && <AdminPanel />}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-sm mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-md">Dancing Flow</h2>
        <p className="text-white/40 font-black uppercase text-[10px] tracking-widest">
          {isRegister ? 'Registro de Estudiante' : 'Bienvenido de nuevo'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
             <div className="space-y-1">
               <label className="text-[9px] font-black text-white/30 uppercase ml-2">Nombre</label>
               <input
                 required
                 value={formData.firstName}
                 onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                 className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-2.5 px-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/10"
                 placeholder="Ej. Juan"
               />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-black text-white/30 uppercase ml-2">Apellido</label>
               <input
                 required
                 value={formData.lastName}
                 onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                 className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-2.5 px-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/10"
                 placeholder="Ej. Perez"
               />
             </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-black text-white/30 uppercase ml-2">Usuario</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/10"
              placeholder="Ej. Andresito"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-white/30 uppercase ml-2">Contraseña (min 8)</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/10"
              placeholder="••••••••"
            />
          </div>
        </div>

        {isRegister && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
            <label className="text-[9px] font-black text-white/30 uppercase ml-2">Token</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input
                required
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/10"
                placeholder="Token de acceso"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
        >
          {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
          {isRegister ? 'Registrarme' : 'Entrar'}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          {isRegister ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
