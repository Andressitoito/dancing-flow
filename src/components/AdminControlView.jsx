import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Users, Filter, BookOpen, BarChart3, Trash2, Search, X, Check, Eye, Target, Zap, Activity, Info, Clock, Award } from 'lucide-react';
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
      title: '¿Eliminar Usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#18181b',
      color: '#fff',
      customClass: { popup: 'rounded-3xl border border-white/10' }
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

  const safeUsers = Array.isArray(users) ? users : [];

  const renderStats = () => {
    const total = safeUsers.length;
    const males = safeUsers.filter(u => u.gender === 'male').length;
    const females = safeUsers.filter(u => u.gender === 'female').length;
    const unidentified = safeUsers.filter(u => u.gender === 'unidentified').length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 animate-in fade-in duration-700">
        {[
          { label: 'Total Alumnos', value: total, color: 'text-primary', icon: Users },
          { label: 'Comunidad Femenina', value: females, color: 'text-pink-400', icon: Heart },
          { label: 'Comunidad Masculina', value: males, color: 'text-blue-400', icon: Activity },
          { label: 'No Identificados', value: unidentified, color: 'text-zinc-500', icon: Info },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-glass/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center text-center gap-4 group hover:border-primary/20 transition-all duration-500">
              <div className={`p-4 bg-black/40 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                 {stat.icon ? <stat.icon size={24} /> : <BarChart3 size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} mt-2 italic tracking-tighter`}>{stat.value}</p>
              </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filtered = safeUsers.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filtered.filter(u => u.gender === 'male');
          const females = filtered.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="bg-surface-glass/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 group hover:border-primary/20 transition-all duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{pref.label}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">Segmentación de Grabación</p>
                  </div>
                  <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-black italic">
                    {filtered.length}
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Hombres ({males.length})</p>
                  </div>
                  <div className="space-y-2">
                    {males.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-sm text-zinc-400 hover:text-primary transition-all flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5">
                          <span className="truncate font-medium">{u.username}</span>
                      </button>
                    ))}
                    {males.length === 0 && <p className="text-xs text-zinc-800 italic ml-4">Sin datos</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em]">Mujeres ({females.length})</p>
                  </div>
                  <div className="space-y-2">
                    {females.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-sm text-zinc-400 hover:text-primary transition-all flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5">
                          <span className="truncate font-medium">{u.username}</span>
                      </button>
                    ))}
                    {females.length === 0 && <p className="text-xs text-zinc-800 italic ml-4">Sin datos</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const filteredUsers = safeUsers.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderUsersList = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Escribe el nombre del alumno..."
          className="w-full bg-zinc-950/50 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-lg outline-none focus:border-primary/50 transition-all shadow-inner"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(u => (
            <div key={u.id} className="bg-surface-glass/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 flex items-center justify-between hover:border-primary/20 hover:bg-surface-glass/20 transition-all duration-500 group">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-xl font-black text-zinc-600 border border-white/5 group-hover:text-primary transition-colors">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{u.username}</h3>
                            {u.isPro && <span className="bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">PRO</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{u.level || 'Sin Nivel'} · {u.role}</p>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <p className="text-xs text-zinc-600 font-medium italic">{u.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {u.role === 'alumno' && (
                        <button onClick={() => handleTogglePro(u)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${u.isPro ? 'text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20' : 'text-zinc-500 bg-white/5 hover:bg-white/10 border border-white/5'}`}>
                            {u.isPro ? 'Desactivar PRO' : 'Activar PRO'}
                        </button>
                    )}
                    <button onClick={() => setViewingUser(u)} className="p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={20} /></button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-4 bg-red-500/5 rounded-2xl text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={20} /></button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const getLabels = (field, ids) => {
    if (!ids) return 'Sin especificar';
    const idList = ids.split(',');
    return idList.map(id => QUESTIONNAIRE_OPTIONS[field]?.find(o => o.id === id)?.label || id).join(', ');
  };

  const Heart = ({ size, className }) => <Activity size={size} className={className} />; // Fallback icon

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[120] bg-background/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
            <div ref={modalRef} className="w-full max-w-5xl max-h-[90vh] bg-surface-glass border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                <header className="p-8 md:p-12 border-b border-white/5 flex justify-between items-end bg-black/40">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-3xl text-primary"><Users size={32} /></div>
                            <div>
                                <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Expediente del Alumno</p>
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{viewingUser.username}</h2>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-5 bg-white/5 hover:bg-primary hover:text-black rounded-3xl text-zinc-500 transition-all duration-500">
                        <X size={32} strokeWidth={3} />
                    </button>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto space-y-12 custom-scrollbar bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { label: 'Motivación Inicial', field: 'whyStarted', icon: Target },
                            { label: 'Objetivos de Baile', field: 'objectives', icon: Award },
                            { label: 'Puntos Críticos', field: 'hardestPart', icon: Zap },
                            { label: 'Miedos y Barreras', field: 'fears', icon: Info },
                        ].map((sect, idx) => (
                            <section key={idx} className="space-y-4 bg-white/5 p-8 rounded-[2rem] border border-white/5">
                                <div className="flex items-center gap-3 text-primary">
                                    <sect.icon size={18} />
                                    <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">{sect.label}</label>
                                </div>
                                <p className="text-lg md:text-xl text-white font-medium leading-relaxed italic">
                                    "{getLabels(sect.field, viewingUser.Questionnaire?.[sect.field])}"
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-12 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="space-y-2 bg-white/5 p-6 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dedicación</p>
                                <p className="text-xl text-white font-bold italic">{viewingUser.Questionnaire?.weeklyDedication || 'No informada'}</p>
                             </div>
                             <div className="space-y-2 bg-white/5 p-6 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Grabación</p>
                                <p className="text-xl text-primary font-black uppercase italic">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                             <div className="space-y-2 bg-white/5 p-6 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nivel Actual</p>
                                <p className="text-xl text-white font-bold italic">{viewingUser.Questionnaire?.experienceLevel || 'Principiante'}</p>
                             </div>
                        </div>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                            <div className="space-y-4 bg-red-500/5 p-8 rounded-[2rem] border border-red-500/20">
                                <div className="flex items-center gap-3 text-red-500">
                                    <Info size={18} />
                                    <label className="text-xs font-black uppercase tracking-[0.3em]">Observaciones Médicas / Físicas</label>
                                </div>
                                <p className="text-xl text-red-100 font-medium italic">"{viewingUser.Questionnaire.physicalLimitations}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Administración Academy</p>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Panel <span className="text-primary">Profesor</span></h1>
          <p className="text-zinc-500 text-base font-medium opacity-60">Control general de la comunidad, estadísticas y segmentación.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-surface-glass/40 backdrop-blur-2xl p-2 rounded-[1.5rem] border border-white/5 shadow-xl">
          {[
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'segmentation', icon: Filter, label: 'Segs' },
            { id: 'users', icon: Users, label: 'Alums' },
            { id: 'classes', icon: BookOpen, label: 'Clases' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveSubTab(t.id)} className={`px-6 py-3 rounded-xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 ${activeSubTab === t.id ? 'bg-primary text-background shadow-lg scale-105' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={16} strokeWidth={3} /> {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
