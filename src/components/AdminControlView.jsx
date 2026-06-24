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

  // Handle click outside to close user profile modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setViewingUser(null);
      }
    };

    if (viewingUser) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [viewingUser]);

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: "Esta acción no se puede deshacer y borrará todo su historial.",
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
        Swal.fire({ icon: 'error', title: 'Error al eliminar', background: '#18181b', color: '#fff' });
      }
    }
  };

  const handleTogglePro = async (user) => {
    try {
      await api.updateUser(user.id, { isPro: !user.isPro });
      fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const renderStats = () => {
    const total = users.length;
    const males = users.filter(u => u.gender === 'male').length;
    const females = users.filter(u => u.gender === 'female').length;
    const unidentified = users.filter(u => u.gender === 'unidentified').length;

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Usuarios', value: total, color: 'text-primary', icon: Users },
            { label: 'Mujeres', value: females, color: 'text-pink-500', icon: Users },
            { label: 'Hombres', value: males, color: 'text-blue-500', icon: Users },
            { label: 'Sin Identificar', value: unidentified, color: 'text-zinc-500', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-glass backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/5 shadow-xl">
                <stat.icon size={18} className={`${stat.color} mb-3`} />
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} italic tracking-tighter mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto animate-in fade-in duration-500">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filteredUsers = users.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filteredUsers.filter(u => u.gender === 'male');
          const females = filteredUsers.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="bg-surface-glass backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/5 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-primary uppercase italic leading-none">{pref.label}</h3>
                    <p className="text-[9px] font-bold text-zinc-500 mt-1.5 uppercase tracking-widest">
                        {filteredUsers.length} TOTAL · {males.length}H / {females.length}M
                    </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest border-b border-blue-500/10 pb-0.5">Hombres</p>
                  {males.map(u => (
                    <button
                        key={u.id}
                        onClick={() => setViewingUser(u)}
                        className="w-full text-left text-xs text-white font-medium hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        {u.username}
                        <Eye size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-pink-500/50 uppercase tracking-widest border-b border-pink-500/10 pb-0.5">Mujeres</p>
                  {females.map(u => (
                    <button
                        key={u.id}
                        onClick={() => setViewingUser(u)}
                        className="w-full text-left text-xs text-white font-medium hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <div className="w-1 h-1 rounded-full bg-pink-500" />
                        {u.username}
                        <Eye size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderUsersList = () => (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Buscar alumno..."
          className="w-full bg-surface-glass border border-white/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition-all text-base"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filteredUsers.map(u => (
            <div key={u.id} className="bg-surface-glass backdrop-blur-xl p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-lg font-black italic text-zinc-600">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{u.username}</h3>
                            {u.isPro && (
                                <span className="bg-primary text-background text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">PRO</span>
                            )}
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${u.role === 'profesor' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                {u.role}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                            {u.level || 'Sin Nivel'} · {u.gender}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {u.role === 'alumno' && (
                        <button
                            onClick={() => handleTogglePro(u)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                u.isPro ? 'bg-primary text-background' : 'bg-zinc-800 text-zinc-500 hover:text-white'
                            }`}
                        >
                            {u.isPro ? 'Quitar Pro' : 'Hacer Pro'}
                        </button>
                    )}
                    <button
                        onClick={() => setViewingUser(u)}
                        className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                    >
                        <Eye size={20} />
                    </button>
                    <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-3 bg-red-500/10 rounded-xl text-red-500/30 hover:text-red-500 transition-all"
                    >
                        <Trash2 size={20} />
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
    return idList.map(id => {
        const opt = QUESTIONNAIRE_OPTIONS[field]?.find(o => o.id === id);
        return opt ? opt.label : id;
    }).join(', ');
  };

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div ref={modalRef} className="w-full max-w-4xl max-h-[90vh] bg-surface rounded-[2rem] border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col">
                <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">Perfil de {viewingUser.username}</h2>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{viewingUser.role} · {viewingUser.level || 'Sin nivel'}</p>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-3 hover:bg-white/5 rounded-full text-zinc-500 transition-all">
                        <X size={24} />
                    </button>
                </header>

                <div className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">¿Por qué empezó?</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{getLabels('whyStarted', viewingUser.Questionnaire?.whyStarted)}</p>
                        </section>
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Objetivos Principales</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{getLabels('objectives', viewingUser.Questionnaire?.objectives)}</p>
                        </section>
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Lo que más cuesta</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{getLabels('hardestPart', viewingUser.Questionnaire?.hardestPart)}</p>
                        </section>
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Miedos y Barreras</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{getLabels('fears', viewingUser.Questionnaire?.fears)}</p>
                        </section>

                        {/* New Questionnaire Fields */}
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Nivel de Experiencia</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{viewingUser.Questionnaire?.experienceLevel || 'No especificado'}</p>
                        </section>
                        <section className="space-y-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Estilos Preferidos</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{viewingUser.Questionnaire?.preferredStyles || 'No especificado'}</p>
                        </section>
                        <section className="space-y-2 md:col-span-2">
                            <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Dedicación Semanal</h4>
                            <p className="text-white text-base font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{viewingUser.Questionnaire?.weeklyDedication || 'No especificada'}</p>
                        </section>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                          <section className="space-y-2 md:col-span-2">
                              <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Limitaciones Físicas / Lesiones</h4>
                              <p className="text-red-400/80 text-base font-medium leading-relaxed bg-red-400/5 p-4 rounded-2xl border border-red-400/10">{viewingUser.Questionnaire?.physicalLimitations}</p>
                          </section>
                        )}
                    </div>

                    <div className="pt-10 border-t border-white/5">
                        <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">Configuración de Entrenamiento</h4>
                        <div className="flex flex-wrap gap-4">
                            <div className="inline-flex items-center gap-3 bg-zinc-900 px-6 py-4 rounded-2xl border border-white/5 text-white text-xs font-black uppercase italic">
                                <Check size={18} className="text-primary" />
                                Preferencia: {getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}
                            </div>
                            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs font-black uppercase italic ${viewingUser.isPro ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
                                <Check size={18} />
                                Cuenta: {viewingUser.isPro ? 'PRO / PREMIUM' : 'ESTÁNDAR'}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-8 bg-zinc-900/50 flex justify-end">
                    <button
                        onClick={() => setViewingUser(null)}
                        className="bg-primary text-background font-black px-8 py-3 rounded-xl uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Cerrar Perfil
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
    <div className="py-8 px-4 md:px-0">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Panel de Profesor</h1>
          <p className="text-zinc-500 text-xs font-medium mt-1.5">Gestiona tu comunidad y personaliza el aprendizaje.</p>
        </div>

        <div className="flex gap-1.5 bg-surface-glass backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-xl overflow-x-auto max-w-full no-scrollbar">
          {subTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest whitespace-nowrap ${
                activeSubTab === t.id
                ? 'bg-primary text-background shadow-lg scale-105'
                : 'text-zinc-500 hover:text-white'
              }`}
            >
              <t.icon size={16} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'stats' && renderStats()}
      {activeSubTab === 'segmentation' && renderSegmentation()}
      {activeSubTab === 'users' && renderUsersList()}
      {activeSubTab === 'classes' && <AdminClassesView />}
    </div>
  );
};

export default AdminControlView;
