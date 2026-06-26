import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Alumnos', value: total, icon: 'group', color: 'text-primary' },
          { label: 'Femenino', value: females, icon: 'female', color: 'text-pink-500' },
          { label: 'Masculino', value: males, icon: 'male', color: 'text-blue-500' },
          { label: 'Sin Datos', value: unidentified, icon: 'help_outline', color: 'text-zinc-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container rounded-[2rem] p-8 flex flex-col items-center text-center gap-4 group border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-xl">
              <div className={`w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-[32px]">{stat.icon}</span>
              </div>
              <div>
                <p className="font-sora text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">{stat.label}</p>
                <p className="font-sora text-5xl font-black text-white mt-2 italic tracking-tighter leading-none">{stat.value}</p>
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
            <div key={pref.id} className="bg-surface-container rounded-[2.5rem] p-8 md:p-10 space-y-8 group border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                 <span className="material-symbols-outlined !text-[120px]">filter_list</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-6 relative z-10">
                  <div>
                    <h3 className="font-sora text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{pref.label}</h3>
                    <p className="font-sora text-[10px] text-zinc-500 mt-2 font-black tracking-widest uppercase">Segmentación de Privacidad</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 text-primary flex items-center justify-center font-sora text-xl font-black italic">
                    {filtered.length}
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <span className="material-symbols-outlined !text-[16px]">male</span>
                    <span className="font-sora text-[10px] font-black tracking-widest uppercase">HOMBRES ({males.length})</span>
                  </div>
                  <div className="space-y-2">
                    {males.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-sm text-zinc-400 hover:text-primary transition-all flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                          <span className="truncate italic font-bold uppercase">{u.username}</span>
                      </button>
                    ))}
                    {males.length > 5 && <p className="text-[10px] text-zinc-700 font-bold italic ml-2">... Y {males.length - 5} MÁS</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-pink-500">
                    <span className="material-symbols-outlined !text-[16px]">female</span>
                    <span className="font-sora text-[10px] font-black tracking-widest uppercase">MUJERES ({females.length})</span>
                  </div>
                  <div className="space-y-2">
                    {females.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-sm text-zinc-400 hover:text-primary transition-all flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500/50"></span>
                          <span className="truncate italic font-bold uppercase">{u.username}</span>
                      </button>
                    ))}
                    {females.length > 5 && <p className="text-[10px] text-zinc-700 font-bold italic ml-2">... Y {females.length - 5} MÁS</p>}
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
      <section className="flex flex-wrap items-center gap-6">
        <div className="relative flex-1 min-w-[300px]">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre de alumno..."
            className="w-full h-14 bg-surface-container border border-white/10 rounded-2xl pl-14 pr-6 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sora text-sm text-white placeholder:text-zinc-700 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 bg-surface-container p-4 rounded-2xl border border-white/5">
            <span className="font-sora text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">TOTAL REGISTRADOS</span>
            <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-primary font-black italic">
                {filteredUsers.length}
            </div>
        </div>
      </section>

      <section className="bg-surface-container rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-[64px_1fr_120px_120px_180px] gap-6 px-8 py-5 bg-black/40 border-b border-white/10 font-sora text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          <div></div>
          <div>Identidad</div>
          <div className="hidden md:block">Evolución</div>
          <div className="hidden md:block">Estatus</div>
          <div className="text-right">Gestión</div>
        </div>

        {/* List Container */}
        <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
          {filteredUsers.map(u => (
              <div key={u.id} className="grid grid-cols-[64px_1fr_120px_120px_180px] gap-6 px-8 py-4 items-center hover:bg-white/[0.03] transition-all duration-300 border-b border-white/5 group">
                  <div className="w-12 h-12 rounded-xl bg-black/60 flex items-center justify-center font-black text-primary/40 italic border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all">
                      {u.username[0].toUpperCase()}
                  </div>
                  <div>
                      <div className="flex items-center gap-3">
                          <p className="font-sora text-lg font-black italic text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{u.username}</p>
                          {u.isPro && <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded italic uppercase kinetic-skew">PRO</span>}
                      </div>
                      <p className="font-sora text-[9px] text-zinc-500 uppercase mt-2 font-bold md:hidden">{u.level || 'Principiante'} • {u.role}</p>
                  </div>
                  <div className="hidden md:block font-sora text-xs text-zinc-400 italic font-bold">{u.level || 'Principiante'}</div>
                  <div className={`hidden md:block font-sora text-[10px] font-black tracking-widest uppercase ${u.role === 'profesor' ? 'text-primary' : 'text-blue-500'}`}>
                    {u.role === 'profesor' ? 'MASTER' : 'ALUMNO'}
                  </div>

                  <div className="flex items-center justify-end gap-3">
                      {u.role === 'alumno' && (
                          <button
                              onClick={() => handleTogglePro(u)}
                              className={`hidden lg:block text-[9px] font-black border-2 px-4 py-1.5 rounded-xl transition-all duration-300 kinetic-skew ${
                                  u.isPro
                                  ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                  : 'border-white/10 text-zinc-600 hover:border-primary hover:text-primary'
                              }`}
                          >
                              {u.isPro ? 'PRO' : 'HACER PRO'}
                          </button>
                      )}
                      <button onClick={() => setViewingUser(u)} className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/40 transition-all shadow-lg">
                        <span className="material-symbols-outlined !text-[20px]">visibility</span>
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-red-900/40 hover:text-red-500 hover:border-red-500/40 transition-all shadow-lg">
                        <span className="material-symbols-outlined !text-[20px]">delete</span>
                      </button>
                  </div>
              </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center opacity-30">
               <span className="material-symbols-outlined !text-[48px] mb-4">search_off</span>
               <p className="font-sora text-sm uppercase font-black italic">No se encontraron alumnos con ese nombre</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const getLabels = (field, ids) => {
    if (!ids) return 'Sin especificar';
    const idList = ids.split(',');
    return idList.map(id => QUESTIONNAIRE_OPTIONS[field]?.find(o => o.id === id)?.label || id).join(', ');
  };

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
            <div ref={modalRef} className="w-full max-w-4xl bg-surface-container border border-white/10 overflow-hidden flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[2.5rem]">
                <header className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start bg-black/20">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                          <span className="material-symbols-outlined !text-[32px]">account_circle</span>
                        </div>
                        <div>
                            <span className="font-sora text-[10px] font-black text-zinc-500 uppercase tracking-widest">Expediente Académico</span>
                            <h2 className="font-sora text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mt-1">{viewingUser.username}</h2>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="w-12 h-12 bg-black/40 rounded-xl border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                        <span className="material-symbols-outlined !text-[24px]">close</span>
                    </button>
                </header>

                <div className="p-8 md:p-10 overflow-y-auto space-y-10 bg-black/10 max-h-[70vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'Propósito Inicial', field: 'whyStarted', icon: 'ads_click' },
                            { label: 'Metas Técnicas', field: 'objectives', icon: 'military_tech' },
                            { label: 'Focos de Mejora', field: 'hardestPart', icon: 'psychology' },
                            { label: 'Limitaciones/Miedos', field: 'fears', icon: 'warning' },
                        ].map((sect, idx) => (
                            <section key={idx} className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-center gap-3 text-primary">
                                    <span className="material-symbols-outlined !text-[18px]">{sect.icon}</span>
                                    <span className="font-sora text-[10px] font-black text-zinc-600 uppercase tracking-widest">{sect.label}</span>
                                </div>
                                <p className="font-sora text-base text-zinc-300 font-light italic leading-relaxed">
                                    "{getLabels(sect.field, viewingUser.Questionnaire?.[sect.field])}"
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                                <span className="font-sora text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Dedicación</span>
                                <p className="font-sora text-xl text-white font-black italic uppercase tracking-tight">{viewingUser.Questionnaire?.weeklyDedication || '---'}</p>
                             </div>
                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                                <span className="font-sora text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Preferencia</span>
                                <p className="font-sora text-base text-primary font-black italic uppercase tracking-tighter leading-none">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                                <span className="font-sora text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Nivel Base</span>
                                <p className="font-sora text-xl text-white font-black italic uppercase tracking-tight">{viewingUser.Questionnaire?.experienceLevel || 'Principiante'}</p>
                             </div>
                        </div>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                            <div className="mt-8 bg-red-500/5 p-8 rounded-[2rem] border border-red-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <span className="material-symbols-outlined !text-[80px]">medical_services</span>
                                </div>
                                <div className="flex items-center gap-3 text-red-500 mb-3 relative z-10">
                                    <span className="material-symbols-outlined !text-[20px]">report</span>
                                    <span className="font-sora text-[10px] font-black text-red-900 uppercase tracking-[0.2em]">Observaciones de Salud</span>
                                </div>
                                <p className="font-sora text-base text-red-100/70 font-light italic leading-relaxed relative z-10">"{viewingUser.Questionnaire.physicalLimitations}"</p>
                            </div>
                        )}
                    </div>
                </div>
                <footer className="p-8 bg-black/40 border-t border-white/5 flex justify-center">
                    <p className="font-sora text-[10px] text-zinc-700 font-bold italic uppercase tracking-widest">Dancing Flow Academy • High Performance Tracking</p>
                </footer>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
      <header className="py-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10">
        <div>
          <h2 className="font-sora text-xs md:text-sm text-primary uppercase tracking-[0.3em] mb-4 font-bold">Gestión de Maestría</h2>
          <div className="flex items-baseline gap-4">
            <h1 className="font-sora text-[48px] md:text-[80px] font-extrabold italic uppercase leading-[0.85] tracking-tighter text-white">Panel</h1>
            <span className="font-sora text-2xl md:text-4xl text-primary italic font-black uppercase tracking-tighter">PROFESOR</span>
          </div>
          <p className="font-sora text-zinc-500 text-sm md:text-base font-light mt-6 max-w-xl">Control absoluto de la comunidad, métricas de evolución y segmentación estratégica.</p>
        </div>

        {/* Contextual Tabs */}
        <div className="bg-surface-container p-1.5 rounded-[1.5rem] flex flex-wrap gap-1 shadow-2xl border border-white/5">
          {[
            { id: 'stats', icon: 'analytics', label: 'STATS' },
            { id: 'segmentation', icon: 'filter_list', label: 'SEGS' },
            { id: 'users', icon: 'group', label: 'ALUMS' },
            { id: 'classes', icon: 'school', label: 'CLASES' }
          ].map(t => (
            <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-500 font-sora text-[10px] font-black tracking-widest ${
                    activeSubTab === t.id
                    ? 'bg-primary text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] kinetic-skew'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: activeSubTab === t.id ? "'FILL' 1" : "'FILL' 0" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
