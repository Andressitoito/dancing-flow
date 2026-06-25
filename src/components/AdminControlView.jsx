import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Users, Filter, BookOpen, BarChart3, Trash2, Search, X, Check, Eye } from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import AdminClassesView from './AdminClassesView';

const AdminControlView = () => {
  const { user: currentUser, users, fetchInitialData } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setViewingUser(null);
      }
    };
    if (viewingUser) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [viewingUser]);

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#18181b',
      color: '#fff'
    });
    if (result.isConfirmed) {
      try {
        await api.deleteUser(id);
        fetchInitialData();
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error' });
      }
    }
  };

  const handleTogglePro = async (user) => {
    try {
      await api.updateUser(user.id, { isPro: !user.isPro });
      fetchInitialData();
    } catch (e) { console.error(e); }
  };

  const renderStats = () => {
    const safeUsers = Array.isArray(users) ? users : [];
    const total = safeUsers.length;
    const males = safeUsers.filter(u => u.gender === 'male').length;
    const females = safeUsers.filter(u => u.gender === 'female').length;
    const unidentified = safeUsers.filter(u => u.gender === 'unidentified').length;

    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Usuarios', value: total, color: 'text-primary', icon: Users },
            { label: 'Mujeres', value: females, color: 'text-pink-400', icon: Users },
            { label: 'Hombres', value: males, color: 'text-blue-400', icon: Users },
            { label: 'Sin Identificar', value: unidentified, color: 'text-zinc-500', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-surface p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <stat.icon size={32} className={`${stat.color} mb-6`} />
                <p className="text-sm font-black text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</p>
                <p className={`text-6xl font-black ${stat.color} italic tracking-tighter mt-4`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSegmentation = () => {
    const safeUsers = Array.isArray(users) ? users : [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filteredUsers = safeUsers.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filteredUsers.filter(u => u.gender === 'male');
          const females = filteredUsers.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="bg-surface p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
              <div>
                  <h3 className="text-3xl font-black text-primary uppercase italic leading-none tracking-tight">{pref.label}</h3>
                  <p className="text-base font-bold text-zinc-500 mt-4 uppercase tracking-widest">
                      {filteredUsers.length} TOTAL · {males.length}H / {females.length}M
                  </p>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-xs font-black text-blue-400/50 uppercase tracking-[0.2em] border-b border-blue-400/10 pb-2">Hombres</p>
                  <div className="space-y-4">
                    {males.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-lg text-white font-medium hover:text-primary transition-colors flex items-center gap-4 group">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          {u.username}
                          <Eye size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    {males.length === 0 && <p className="text-base text-zinc-700 italic">Sin datos</p>}
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-xs font-black text-pink-400/50 uppercase tracking-[0.2em] border-b border-pink-400/10 pb-2">Mujeres</p>
                  <div className="space-y-4">
                    {females.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-lg text-white font-medium hover:text-primary transition-colors flex items-center gap-4 group">
                          <div className="w-2 h-2 rounded-full bg-pink-400" />
                          {u.username}
                          <Eye size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    {females.length === 0 && <p className="text-base text-zinc-700 italic">Sin datos</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderUsersList = () => (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500" size={28} />
        <input
          type="text"
          placeholder="Buscar alumno por nombre..."
          className="w-full bg-surface border border-white/5 rounded-[2rem] py-6 pl-20 pr-8 outline-none focus:border-primary transition-all text-xl shadow-2xl"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredUsers.map(u => (
            <div key={u.id} className="bg-surface p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between hover:border-primary/20 transition-all group shadow-xl">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl font-black italic text-zinc-600 shadow-inner">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-white leading-none">{u.username}</h3>
                            {u.isPro && (
                                <span className="bg-primary text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">PRO</span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-[0.2em]">
                            {u.level || 'Sin Nivel'} · {u.gender} · {u.role}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {u.role === 'alumno' && (
                        <button onClick={() => handleTogglePro(u)} className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${u.isPro ? 'bg-primary text-background' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                            {u.isPro ? 'Quitar Pro' : 'Hacer Pro'}
                        </button>
                    )}
                    <button onClick={() => setViewingUser(u)} className="p-5 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all shadow-lg">
                        <Eye size={28} />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-5 bg-red-500/10 rounded-2xl text-red-500/20 hover:text-red-500 transition-all">
                        <Trash2 size={28} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const getLabels = (field, ids) => {
    if (!ids) return 'Sin respuesta';
    const idList = ids.split(',');
    return idList.map(id => QUESTIONNAIRE_OPTIONS[field]?.find(o => o.id === id)?.label || id).join(', ');
  };

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div ref={modalRef} className="w-full max-w-6xl max-h-[90vh] bg-surface rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar flex flex-col">
                <header className="sticky top-0 z-20 bg-surface/98 backdrop-blur-2xl border-b border-white/5 p-10 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shadow-inner">
                            <Users size={40} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Perfil de {viewingUser.username}</h2>
                            <p className="text-sm text-zinc-500 font-bold uppercase tracking-[0.3em] mt-4">{viewingUser.role} · {viewingUser.level || 'Nivel no definido'}</p>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-5 hover:bg-white/5 rounded-full text-zinc-500 transition-all">
                        <X size={40} />
                    </button>
                </header>

                <div className="p-12 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <section className="space-y-6">
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Motivación</h4>
                            <p className="text-zinc-100 text-xl font-medium leading-relaxed bg-zinc-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">{getLabels('whyStarted', viewingUser.Questionnaire?.whyStarted)}</p>
                        </section>
                        <section className="space-y-6">
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Objetivos</h4>
                            <p className="text-zinc-100 text-xl font-medium leading-relaxed bg-zinc-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">{getLabels('objectives', viewingUser.Questionnaire?.objectives)}</p>
                        </section>
                        <section className="space-y-6">
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Retos</h4>
                            <p className="text-zinc-100 text-xl font-medium leading-relaxed bg-zinc-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">{getLabels('hardestPart', viewingUser.Questionnaire?.hardestPart)}</p>
                        </section>
                        <section className="space-y-6">
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Miedos</h4>
                            <p className="text-zinc-100 text-xl font-medium leading-relaxed bg-zinc-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">{getLabels('fears', viewingUser.Questionnaire?.fears)}</p>
                        </section>
                    </div>

                    <div className="pt-16 border-t border-white/5 space-y-10">
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Configuración Adicional</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 space-y-4 shadow-md">
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Dedicación</span>
                                <p className="text-xl text-white font-bold">{viewingUser.Questionnaire?.weeklyDedication || 'No informada'}</p>
                             </div>
                             <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 space-y-4 shadow-md">
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Estilos</span>
                                <p className="text-xl text-white font-bold">{viewingUser.Questionnaire?.preferredStyles || 'No informados'}</p>
                             </div>
                        </div>
                    </div>
                </div>

                <footer className="p-12 bg-zinc-950/50 flex justify-end">
                    <button onClick={() => setViewingUser(null)} className="bg-primary text-background font-black px-12 py-6 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        CERRAR PERFIL
                    </button>
                </footer>
            </div>
        </div>
    )
  }

  const subTabs = [
    { id: 'stats', icon: BarChart3, label: 'Resumen' },
    { id: 'segmentation', icon: Filter, label: 'Segmentación' },
    { id: 'users', icon: Users, label: 'Alumnos' },
    { id: 'classes', icon: BookOpen, label: 'Clases' }
  ];

  return (
    <div className="py-12 px-8 lg:px-0 max-w-7xl mx-auto space-y-16">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 bg-surface p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Panel de Profesor</h1>
          <p className="text-zinc-500 text-xl font-medium">Administración y seguimiento personalizado de la comunidad.</p>
        </div>
        <div className="flex gap-3 bg-background/60 backdrop-blur-2xl border border-white/10 p-3 rounded-[1.5rem] shadow-inner relative z-10">
          {subTabs.map(t => (
            <button key={t.id} onClick={() => setActiveSubTab(t.id)} className={`flex items-center gap-4 px-8 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeSubTab === t.id ? 'bg-primary text-background shadow-2xl scale-105' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={22} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
