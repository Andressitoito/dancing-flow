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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alumnos', value: total, icon: 'group' },
          { label: 'Femenino', value: females, icon: 'female' },
          { label: 'Masculino', value: males, icon: 'male' },
          { label: 'Sin Datos', value: unidentified, icon: 'help_outline' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center text-center gap-2 group border-white/5">
              <span className="material-symbols-outlined text-primary text-[24px] mb-2">{stat.icon}</span>
              <div>
                <p className="label-luxury !text-[8px] !text-zinc-500">{stat.label}</p>
                <p className="font-sora text-3xl font-bold text-white mt-1 italic tracking-tighter">{stat.value}</p>
              </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filtered = safeUsers.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filtered.filter(u => u.gender === 'male');
          const females = filtered.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="glass-card p-6 space-y-6 group border-white/5">
              <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                  <div>
                    <h3 className="font-sora text-lg font-bold text-white uppercase italic tracking-tighter">{pref.label}</h3>
                    <p className="label-luxury !text-[8px] !text-zinc-600 mt-1">Segmentación de Grabación</p>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 rounded border border-primary/20 text-primary label-luxury !text-[9px]">
                    {filtered.length}
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <span className="label-luxury !text-blue-400 !text-[8px]">Hombres ({males.length})</span>
                  <div className="space-y-1">
                    {males.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-xs text-zinc-500 hover:text-primary transition-all flex items-center gap-2">
                          <span className="truncate">• {u.username}</span>
                      </button>
                    ))}
                    {males.length > 5 && <p className="text-[9px] text-zinc-700">y {males.length - 5} más...</p>}
                  </div>
                </div>
                <div className="space-y-3">
                  <span className="label-luxury !text-pink-400 !text-[8px]">Mujeres ({females.length})</span>
                  <div className="space-y-1">
                    {females.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left font-sora text-xs text-zinc-500 hover:text-primary transition-all flex items-center gap-2">
                          <span className="truncate">• {u.username}</span>
                      </button>
                    ))}
                    {females.length > 5 && <p className="text-[9px] text-zinc-700">y {females.length - 5} más...</p>}
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Escribe el nombre del alumno..."
            className="pl-12 h-[44px] bg-white/5 border-white/10 rounded-lg text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-zinc-500 label-luxury !text-[9px]">TOTAL: {filteredUsers.length} ALUMNOS</div>
      </div>

      <div className="bg-white/[0.02] rounded-lg border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_100px_100px_140px] gap-4 px-6 py-3 bg-white/[0.03] border-b border-white/5 label-luxury !text-[9px] !text-zinc-500 uppercase">
          <div></div>
          <div>Nombre / Identidad</div>
          <div className="hidden md:block">Nivel</div>
          <div className="hidden md:block">Rol</div>
          <div className="text-right">Acciones</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {filteredUsers.map(u => (
              <div key={u.id} className="grid grid-cols-[40px_1fr_100px_100px_140px] gap-4 px-6 py-3 items-center hover:bg-white/[0.03] border-b border-white/[0.02] transition-colors group">
                  <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center font-bold text-primary/50 italic border border-white/5 group-hover:text-primary transition-colors text-xs">
                      {u.username[0].toUpperCase()}
                  </div>
                  <div>
                      <div className="flex items-center gap-2">
                          <h3 className="font-sora text-sm font-bold text-white italic uppercase tracking-tight group-hover:text-primary transition-colors">{u.username}</h3>
                          {u.isPro && <span className="bg-primary/10 text-primary text-[7px] font-bold px-2 py-0.5 rounded border border-primary/20">PRO</span>}
                      </div>
                      <p className="md:hidden label-luxury !text-[7px] !text-zinc-600 mt-0.5">{u.level || 'Sin Nivel'} · {u.role}</p>
                  </div>
                  <div className="hidden md:block text-xs text-zinc-500">{u.level || 'Sin Nivel'}</div>
                  <div className={`hidden md:block text-[10px] font-bold ${u.role === 'profesor' ? 'text-primary' : 'text-blue-400'} uppercase`}>{u.role}</div>

                  <div className="flex items-center justify-end gap-2">
                      {u.role === 'alumno' && (
                          <button
                              onClick={() => handleTogglePro(u)}
                              className={`hidden lg:block text-[8px] font-bold border px-2 py-1 rounded transition-all ${
                                  u.isPro ? 'text-primary border-primary/30 bg-primary/10' : 'text-zinc-600 border-white/10 hover:border-primary hover:text-primary'
                              }`}
                          >
                              {u.isPro ? 'PRO ACTIVO' : 'ACTIVAR PRO'}
                          </button>
                      )}
                      <button onClick={() => setViewingUser(u)} className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-primary/20 transition-all"><span className="material-symbols-outlined !text-[18px]">visibility</span></button>
                      <button onClick={() => handleDeleteUser(u.id)} className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"><span className="material-symbols-outlined !text-[18px]">delete</span></button>
                  </div>
              </div>
          ))}
        </div>
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
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div ref={modalRef} className="w-full max-w-4xl glass-card border-white/10 overflow-hidden flex flex-col shadow-2xl rounded-xl">
                <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/10">
                          <span className="material-symbols-outlined text-[28px]">person</span>
                        </div>
                        <div>
                            <span className="label-luxury !text-[8px]">Expediente del Alumno</span>
                            <h2 className="font-sora text-3xl md:text-4xl font-bold text-white uppercase italic tracking-tighter leading-none">{viewingUser.username}</h2>
                        </div>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white">
                        <span className="material-symbols-outlined !text-[24px]">close</span>
                    </button>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto space-y-8 bg-black/20 max-h-[70vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Motivación Inicial', field: 'whyStarted', icon: 'target' },
                            { label: 'Objetivos de Baile', field: 'objectives', icon: 'award_star' },
                            { label: 'Puntos Críticos', field: 'hardestPart', icon: 'bolt' },
                            { label: 'Miedos y Barreras', field: 'fears', icon: 'info' },
                        ].map((sect, idx) => (
                            <section key={idx} className="space-y-3 bg-white/[0.03] p-6 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined !text-[16px]">{sect.icon}</span>
                                    <span className="label-luxury !text-[8px] !text-zinc-500">{sect.label}</span>
                                </div>
                                <p className="font-sora text-sm text-white font-light italic">
                                    "{getLabels(sect.field, viewingUser.Questionnaire?.[sect.field])}"
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Dedicación</span>
                                <p className="font-sora text-lg text-white font-bold italic mt-1">{viewingUser.Questionnaire?.weeklyDedication || 'No informada'}</p>
                             </div>
                             <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Grabación</span>
                                <p className="font-sora text-lg text-primary font-bold italic mt-1 uppercase text-xs">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                             <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5 text-center">
                                <span className="label-luxury !text-[8px] !text-zinc-600">Nivel Actual</span>
                                <p className="font-sora text-lg text-white font-bold italic mt-1">{viewingUser.Questionnaire?.experienceLevel || 'Principiante'}</p>
                             </div>
                        </div>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                            <div className="mt-6 bg-red-500/5 p-6 rounded-lg border border-red-500/10">
                                <div className="flex items-center gap-2 text-red-500 mb-2">
                                    <span className="material-symbols-outlined !text-[16px]">info</span>
                                    <span className="label-luxury !text-[8px]">Observaciones Físicas</span>
                                </div>
                                <p className="font-sora text-sm text-red-100 font-light italic">"{viewingUser.Questionnaire.physicalLimitations}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="label-luxury !text-[9px]">Administración Academy</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white italic uppercase tracking-tighter leading-none">Panel</h1>
            <span className="font-sora text-2xl md:text-3xl text-primary italic font-bold uppercase">Profesor</span>
          </div>
          <p className="font-sora text-zinc-500 text-sm font-light mt-2">Control estratégico de la comunidad y segmentación.</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-lg">
          {[
            { id: 'stats', icon: 'analytics', label: 'Stats' },
            { id: 'segmentation', icon: 'filter_list', label: 'Segs' },
            { id: 'users', icon: 'group', label: 'Alums' },
            { id: 'classes', icon: 'school', label: 'Clases' }
          ].map(t => (
            <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeSubTab === t.id
                    ? 'bg-primary text-black'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="material-symbols-outlined !text-[18px]">{t.icon}</span>
              <span className="label-luxury !text-[8px] !color-inherit">{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="pb-12">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
