import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Users, Filter, BookOpen, BarChart3, Trash2, Search, X, Eye, Target, Zap, Activity, Info, Award } from 'lucide-react';
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
      confirmButtonColor: '#D4AF37',
      background: '#051424',
      color: '#fff',
      customClass: { popup: 'glass-card border-primary/40' }
    });
    if (result.isConfirmed) {
      try {
        await api.deleteUser(id);
        fetchInitialData();
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', background: '#051424', color: '#fff' });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Total Alumnos', value: total, icon: Users },
          { label: 'Femenino', value: females, icon: Activity },
          { label: 'Masculino', value: males, icon: Activity },
          { label: 'Sin Datos', value: unidentified, icon: Info },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 flex flex-col items-center text-center gap-4 group">
              <div className="p-4 bg-primary/10 rounded text-primary group-hover:scale-110 transition-transform">
                 <stat.icon size={24} />
              </div>
              <div>
                <p className="label-luxury !text-[8px] !text-zinc-500">{stat.label}</p>
                <p className="font-sora text-4xl font-bold text-white mt-2 italic tracking-tighter">{stat.value}</p>
              </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filtered = safeUsers.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filtered.filter(u => u.gender === 'male');
          const females = filtered.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="glass-card p-10 space-y-8 group">
              <div className="flex items-center justify-between border-b border-primary/10 pb-6">
                  <div>
                    <h3 className="font-sora text-2xl font-bold text-white uppercase italic tracking-tighter">{pref.label}</h3>
                    <p className="label-luxury !text-[8px] !text-zinc-600 mt-2">Segmentación de Grabación</p>
                  </div>
                  <div className="px-4 py-2 bg-primary/10 rounded border border-primary/20 text-primary label-luxury !text-[10px]">
                    {filtered.length}
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="label-luxury !text-blue-400 !text-[8px]">Hombres ({males.length})</span>
                  <div className="space-y-2">
                    {males.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-sm text-zinc-500 hover:text-primary transition-all flex items-center gap-2">
                          <span className="truncate">• {u.username}</span>
                      </button>
                    ))}
                    {males.length > 5 && <p className="text-[10px] text-zinc-700">y {males.length - 5} más...</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="label-luxury !text-pink-400 !text-[8px]">Mujeres ({females.length})</span>
                  <div className="space-y-2">
                    {females.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-sm text-zinc-500 hover:text-primary transition-all flex items-center gap-2">
                          <span className="truncate">• {u.username}</span>
                      </button>
                    ))}
                    {females.length > 5 && <p className="text-[10px] text-zinc-700">y {females.length - 5} más...</p>}
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
    <div className="space-y-8">
      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
        <input
          type="text"
          placeholder="Escribe el nombre del alumno..."
          className="pl-16 h-16"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(u => (
            <div key={u.id} className="glass-card p-6 flex items-center justify-between hover:border-primary/20 transition-all duration-500 group">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-black rounded flex items-center justify-center text-xl font-bold text-primary/30 border border-primary/10 group-hover:text-primary transition-colors">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-sora text-xl font-bold text-white italic uppercase tracking-tight">{u.username}</h3>
                            {u.isPro && <span className="bg-primary/10 text-primary text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20 neon-gold">PRO</span>}
                        </div>
                        <p className="label-luxury !text-[8px] !text-zinc-600 mt-1">{u.level || 'Sin Nivel'} · {u.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {u.role === 'alumno' && (
                        <button
                            onClick={() => handleTogglePro(u)}
                            className={`label-luxury !text-[9px] px-4 py-2 rounded border transition-all ${
                                u.isPro ? 'text-primary border-primary/30 bg-primary/10' : 'text-zinc-600 border-white/10 hover:text-white'
                            }`}
                        >
                            {u.isPro ? 'PRO ACTIVO' : 'ACTIVAR PRO'}
                        </button>
                    )}
                    <button onClick={() => setViewingUser(u)} className="p-3 bg-white/5 rounded text-zinc-500 hover:text-white transition-all"><Eye size={18} /></button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-red-500/5 rounded text-red-500/30 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[120] bg-black/98 flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
            <div ref={modalRef} className="w-full max-w-5xl glass-card border-primary/20 overflow-hidden flex flex-col shadow-2xl">
                <header className="p-8 md:p-12 border-b border-primary/10 flex justify-between items-end bg-black/40">
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/10 rounded text-primary"><Users size={32} /></div>
                            <div>
                                <span className="label-luxury">Expediente del Alumno</span>
                                <h2 className="font-sora text-4xl md:text-5xl font-bold text-white uppercase italic tracking-tighter leading-none">{viewingUser.username}</h2>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="btn-secondary !p-4 !rounded">
                        <X size={24} strokeWidth={3} />
                    </button>
                </header>

                <div className="p-8 md:p-12 overflow-y-auto space-y-12 bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { label: 'Motivación Inicial', field: 'whyStarted', icon: Target },
                            { label: 'Objetivos de Baile', field: 'objectives', icon: Award },
                            { label: 'Puntos Críticos', field: 'hardestPart', icon: Zap },
                            { label: 'Miedos y Barreras', field: 'fears', icon: Info },
                        ].map((sect, idx) => (
                            <section key={idx} className="space-y-4 bg-white/5 p-8 rounded border border-primary/5">
                                <div className="flex items-center gap-3 text-primary">
                                    <sect.icon size={16} />
                                    <span className="label-luxury !text-[9px] !text-zinc-500">{sect.label}</span>
                                </div>
                                <p className="font-sora text-lg text-white font-light italic">
                                    "{getLabels(sect.field, viewingUser.Questionnaire?.[sect.field])}"
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="border-t border-primary/10 pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="bg-white/5 p-6 rounded border border-primary/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Dedicación</span>
                                <p className="font-sora text-xl text-white font-bold italic mt-2">{viewingUser.Questionnaire?.weeklyDedication || 'No informada'}</p>
                             </div>
                             <div className="bg-white/5 p-6 rounded border border-primary/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Grabación</span>
                                <p className="font-sora text-xl text-primary font-bold italic mt-2 uppercase">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                             <div className="bg-white/5 p-6 rounded border border-primary/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Nivel Actual</span>
                                <p className="font-sora text-xl text-white font-bold italic mt-2">{viewingUser.Questionnaire?.experienceLevel || 'Principiante'}</p>
                             </div>
                        </div>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                            <div className="mt-8 bg-red-500/5 p-8 rounded border border-red-500/20">
                                <div className="flex items-center gap-3 text-red-500 mb-4">
                                    <Info size={18} />
                                    <span className="label-luxury !text-[9px]">Observaciones Físicas</span>
                                </div>
                                <p className="font-sora text-xl text-red-200 font-light italic">"{viewingUser.Questionnaire.physicalLimitations}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12">
        <div className="space-y-4">
          <span className="label-luxury">Administración Academy</span>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold text-white italic uppercase tracking-tighter leading-none">Panel <span className="text-primary">Profesor</span></h1>
          <p className="font-sora text-zinc-500 text-lg font-light">Control estratégico de la comunidad y segmentación.</p>
        </div>

        <div className="flex flex-wrap gap-2 glass-card !p-2 rounded">
          {[
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'segmentation', icon: Filter, label: 'Segmentos' },
            { id: 'users', icon: Users, label: 'Alumnos' },
            { id: 'classes', icon: BookOpen, label: 'Clases' }
          ].map(t => (
            <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                className={`px-6 py-3 rounded transition-all duration-300 flex items-center gap-3 ${
                    activeSubTab === t.id
                    ? 'bg-primary text-black scale-105'
                    : 'text-zinc-500 hover:text-white'
                }`}
            >
              <t.icon size={16} />
              <span className="label-luxury !text-[9px] !color-inherit">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="pb-24">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
