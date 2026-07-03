import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Users, UserPlus, Trash2, Shield, ShieldAlert,
  BarChart3, Filter, Search, ChevronRight,
  Eye, GraduationCap, Venus, Mars, HelpCircle,
  TrendingUp, Calendar, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from '../services/api';

const AdminControlView = () => {
  const { users, fetchInitialData } = useStore();
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'segments'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#051424',
      color: '#fff'
    });

    if (result.isConfirmed) {
      const res = await api.deleteUser(userId);
      if (res.success) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado.',
          icon: 'success',
          background: '#051424',
          color: '#fff'
        });
        fetchInitialData();
      }
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'profesor' ? 'alumno' : 'profesor';
    const result = await Swal.fire({
      title: `¿Cambiar a ${newRole}?`,
      text: "Se modificarán los permisos del usuario.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      background: '#051424',
      color: '#fff'
    });

    if (result.isConfirmed) {
      // Note: The API changeRole requires a master token usually,
      // but here we use updateUser for general admin changes if applicable
      const res = await api.updateUser(userId, { role: newRole });
      if (res.id) {
        Swal.fire({
          title: 'Actualizado',
          text: 'Rol modificado correctamente.',
          icon: 'success',
          background: '#051424',
          color: '#fff'
        });
        fetchInitialData();
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    femenino: users.filter(u => u.gender === 'mujer' || u.gender === 'female').length,
    masculino: users.filter(u => u.gender === 'hombre' || u.gender === 'male').length,
    otros: users.filter(u => u.gender === 'otro' || u.gender === 'other' || !u.gender || u.gender === 'unidentified').length
  };

  return (
    <div className="max-container">
      {/* Header */}
      <header className="py-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5">
        <div>
          <span className="font-sora text-[10px] text-primary uppercase tracking-[0.4em] font-bold mb-4 block">ADMINISTRACIÓN ACADEMY</span>
          <h1 className="font-sora text-5xl italic font-black text-on-surface leading-tight uppercase tracking-tighter">
            Panel <span className="text-primary italic">Profesor</span>
          </h1>
          <p className="font-inter text-lg text-on-surface-variant mt-4">Control de comunidad, métricas y segmentación en tiempo real.</p>
        </div>

        {/* View Switcher */}
        <div className="bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-white/5">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'stats' ? 'bg-primary text-black active-glow' : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <BarChart3 size={16} /> STATS
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'users' ? 'bg-primary text-black active-glow' : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <Users size={16} /> ALUMS
          </button>
          <button
            onClick={() => setActiveTab('segments')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'segments' ? 'bg-primary text-black active-glow' : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <Filter size={16} /> SEGS
          </button>
        </div>
      </header>

      {activeTab === 'stats' && (
        <div className="py-12 space-y-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-primary" size={24} />
              </div>
              <span className="font-sora text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-bold mb-2">Total Alumnos</span>
              <span className="font-sora text-5xl font-black italic text-primary">{stats.total}</span>
            </div>
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Venus className="text-primary" size={24} />
              </div>
              <span className="font-sora text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-bold mb-2">Comunidad Femenina</span>
              <span className="font-sora text-5xl font-black italic text-primary">{stats.femenino}</span>
            </div>
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group hover:border-secondary/40 transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mars className="text-secondary" size={24} />
              </div>
              <span className="font-sora text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-bold mb-2">Comunidad Masculina</span>
              <span className="font-sora text-5xl font-black italic text-secondary">{stats.masculino}</span>
            </div>
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group hover:border-white/20 transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HelpCircle className="text-zinc-500" size={24} />
              </div>
              <span className="font-sora text-[10px] text-on-surface-variant tracking-[0.2em] uppercase font-bold mb-2">No Identificados</span>
              <span className="font-sora text-5xl font-black italic text-zinc-500">{stats.otros}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-card rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
               <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-sora text-sm font-black text-on-surface uppercase tracking-widest italic">Actividad Semanal</h3>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-2 font-sora text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">
                        <span className="w-2 h-2 rounded-full bg-primary"></span> Bachata
                     </span>
                     <span className="flex items-center gap-2 font-sora text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span> Salsa
                     </span>
                  </div>
               </div>
               <div className="flex-1 p-8 flex items-end justify-between gap-4">
                  {[60, 45, 90, 30, 75, 55, 80].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                       <div className="w-full bg-white/5 rounded-t-lg relative group overflow-hidden" style={{ height: '200px' }}>
                          <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700" style={{ height: `${val}%` }}></div>
                          <div className="absolute bottom-0 w-full bg-secondary/40 rounded-t-lg transition-all duration-1000" style={{ height: `${val * 0.7}%` }}></div>
                       </div>
                       <span className="font-sora text-[8px] uppercase tracking-widest font-bold text-on-surface-variant">
                         {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'][i]}
                       </span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
               <div className="glass-card rounded-2xl p-8 flex-1">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="font-sora text-sm font-black text-on-surface uppercase tracking-widest italic">Próximas Clases</h3>
                     <RefreshCw size={16} className="text-primary cursor-pointer hover:rotate-180 transition-all duration-500" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { day: 'Mar', date: '14', title: 'Bachata Sensual III', time: '19:30 - Studio A' },
                      { day: 'Mie', date: '15', title: 'Salsa On2 Advanced', time: '21:00 - Main Hall' }
                    ].map((cls, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 shrink-0">
                          <span className="font-sora text-[8px] text-primary uppercase font-bold">{cls.day}</span>
                          <span className="font-sora text-lg text-on-surface font-black">{cls.date}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest truncate">{cls.title}</p>
                          <p className="font-inter text-[10px] text-on-surface-variant flex items-center gap-1">
                            <Calendar size={10} /> {cls.time}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-zinc-700 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 border border-white/10 py-4 rounded-xl font-sora text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
                    Ver Agenda Completa
                  </button>
               </div>

               <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
                  <GraduationCap className="absolute -right-4 -bottom-4 text-black/10 w-32 h-32 group-hover:rotate-12 transition-transform" />
                  <h4 className="font-sora text-2xl font-black italic text-black leading-tight uppercase tracking-tighter">Nueva<br/>Inscripción</h4>
                  <p className="font-inter text-xs text-black/70 max-w-[150px] font-semibold">Agrega un nuevo talento a la comunidad hoy mismo.</p>
                  <button className="mt-4 bg-black text-primary w-fit px-8 py-3 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Registrar
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="py-12 space-y-8">
           <div className="flex flex-wrap items-center gap-6">
              <div className="relative flex-1 min-w-[300px]">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                 <input
                   type="text"
                   placeholder="Buscar alumno por nombre..."
                   className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-6">
                 <button className="h-16 px-8 border border-white/10 rounded-2xl text-on-surface-variant font-sora text-[10px] font-bold uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all flex items-center gap-3">
                    <Filter size={16} /> FILTRAR
                 </button>
                 <div className="h-8 w-px bg-white/10"></div>
                 <span className="font-sora text-[10px] text-on-surface-variant font-black uppercase tracking-widest">
                    TOTAL: {filteredUsers.length} ALUMNOS
                 </span>
              </div>
           </div>

           <div className="glass-card rounded-2xl overflow-hidden border-none">
              <div className="grid grid-cols-[80px_1fr_150px_150px_200px] gap-6 px-10 py-6 bg-white/5 border-b border-white/5 font-sora text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] italic">
                 <div>ID</div>
                 <div>Nombre / Identidad</div>
                 <div>Nivel</div>
                 <div>Rol</div>
                 <div className="text-right">Acciones</div>
              </div>

              <div className="divide-y divide-white/5">
                 {filteredUsers.map((u) => (
                   <div key={u.id} className="grid grid-cols-[80px_1fr_150px_150px_200px] gap-6 px-10 py-6 items-center hover:bg-white/[0.02] transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-background border border-white/5 flex items-center justify-center font-sora font-black text-primary italic">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                         <p className="font-sora text-lg font-black italic text-on-surface group-hover:text-primary transition-colors uppercase tracking-tight">{u.username}</p>
                         <p className="font-inter text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Inscrito: {new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="font-sora text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                         {u.level || 'Principiante'}
                      </div>
                      <div className={`font-sora text-[10px] font-bold uppercase tracking-widest ${u.role === 'profesor' ? 'text-primary' : 'text-secondary'}`}>
                         {u.role}
                      </div>
                      <div className="flex items-center justify-end gap-3">
                         <button
                           onClick={() => handleChangeRole(u.id, u.role)}
                           className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
                           title="Cambiar Rol"
                         >
                            <Shield size={18} />
                         </button>
                         <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-white/5">
                            <Eye size={18} />
                         </button>
                         <button
                           onClick={() => handleDeleteUser(u.id)}
                           className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="py-12">
           <div className="glass-card p-20 rounded-2xl text-center border-dashed border-2 border-white/10">
              <Filter size={48} className="text-primary/20 mx-auto mb-8" />
              <h2 className="font-sora text-2xl font-black italic text-on-surface uppercase tracking-tighter mb-4">Módulo de Segmentación Avanzada</h2>
              <p className="font-inter text-on-surface-variant max-w-md mx-auto">Esta funcionalidad te permitirá agrupar alumnos por objetivos, limitaciones o nivel de compromiso. Próximamente disponible.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminControlView;
