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
      title: '¿Eliminar?',
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

  const safeUsers = Array.isArray(users) ? users : [];

  const renderStats = () => {
    const total = safeUsers.length;
    const males = safeUsers.filter(u => u.gender === 'male').length;
    const females = safeUsers.filter(u => u.gender === 'female').length;
    const unidentified = safeUsers.filter(u => u.gender === 'unidentified').length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
        {[
          { label: 'Total', value: total, color: 'text-primary' },
          { label: 'Mujeres', value: females, color: 'text-pink-400' },
          { label: 'Hombres', value: males, color: 'text-blue-400' },
          { label: 'Otros', value: unidentified, color: 'text-zinc-500' },
        ].map((stat, i) => (
          <div key={i} className="card flex flex-col items-center justify-center text-center py-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filtered = safeUsers.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filtered.filter(u => u.gender === 'male');
          const females = filtered.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="card space-y-4">
              <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">{pref.label}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{filtered.length} total · {males.length}H / {females.length}M</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-blue-400/40 uppercase tracking-widest">Hombres</p>
                  <div className="space-y-1">
                    {males.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-xs text-zinc-300 hover:text-primary transition-colors flex items-center gap-2 group">
                          <div className="w-1 h-1 rounded-full bg-blue-400" />
                          <span className="truncate">{u.username}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-pink-400/40 uppercase tracking-widest">Mujeres</p>
                  <div className="space-y-1">
                    {females.map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-xs text-zinc-300 hover:text-primary transition-colors flex items-center gap-2 group">
                          <div className="w-1 h-1 rounded-full bg-pink-400" />
                          <span className="truncate">{u.username}</span>
                      </button>
                    ))}
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
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input
          type="text"
          placeholder="Buscar alumno..."
          className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        {filteredUsers.map(u => (
            <div key={u.id} className="card p-3 flex items-center justify-between hover:border-white/10 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-500">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{u.username}</h3>
                            {u.isPro && <span className="bg-primary/20 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase">PRO</span>}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">{u.level || 'S/N'} · {u.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {u.role === 'alumno' && (
                        <button onClick={() => handleTogglePro(u)} className={`p-2 rounded-lg text-[10px] font-bold uppercase transition-all ${u.isPro ? 'text-primary bg-primary/5' : 'text-zinc-500 hover:bg-white/5'}`}>
                            {u.isPro ? 'Quitar Pro' : 'Hacer Pro'}
                        </button>
                    )}
                    <button onClick={() => setViewingUser(u)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Eye size={16} /></button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500/30 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const getLabels = (field, ids) => {
    if (!ids) return 'N/A';
    const idList = ids.split(',');
    return idList.map(id => QUESTIONNAIRE_OPTIONS[field]?.find(o => o.id === id)?.label || id).join(', ');
  };

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div ref={modalRef} className="w-full max-w-2xl max-h-[85vh] card !p-0 overflow-hidden flex flex-col shadow-2xl">
                <header className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Users size={20} /></div>
                        <h2 className="text-lg font-bold text-white uppercase italic">{viewingUser.username}</h2>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-all"><X size={20} /></button>
                </header>

                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="space-y-1">
                            <label>Motivación</label>
                            <p className="text-sm text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">{getLabels('whyStarted', viewingUser.Questionnaire?.whyStarted)}</p>
                        </section>
                        <section className="space-y-1">
                            <label>Objetivos</label>
                            <p className="text-sm text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">{getLabels('objectives', viewingUser.Questionnaire?.objectives)}</p>
                        </section>
                        <section className="space-y-1">
                            <label>Retos</label>
                            <p className="text-sm text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">{getLabels('hardestPart', viewingUser.Questionnaire?.hardestPart)}</p>
                        </section>
                        <section className="space-y-1">
                            <label>Miedos</label>
                            <p className="text-sm text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">{getLabels('fears', viewingUser.Questionnaire?.fears)}</p>
                        </section>
                    </div>

                    <div className="border-t border-white/5 pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label>Dedicación</label>
                                <p className="text-sm text-white font-bold">{viewingUser.Questionnaire?.weeklyDedication || 'N/A'}</p>
                             </div>
                             <div className="space-y-1 text-right">
                                <label>Preferencia</label>
                                <p className="text-[10px] font-black text-primary uppercase">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                        </div>
                        {viewingUser.Questionnaire?.physicalLimitations && (
                            <div className="space-y-1 bg-red-400/5 p-3 rounded-lg border border-red-400/10">
                                <label className="!text-red-400">Lesiones / Limitaciones</label>
                                <p className="text-sm text-red-100">{viewingUser.Questionnaire.physicalLimitations}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-white/5 pb-4">
        <h1 className="text-xl font-extrabold text-white uppercase italic tracking-tighter">Panel de Profesor</h1>
        <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-white/5">
          {[
            { id: 'stats', icon: BarChart3, label: 'Stats' },
            { id: 'segmentation', icon: Filter, label: 'Segs' },
            { id: 'users', icon: Users, label: 'Alums' },
            { id: 'classes', icon: BookOpen, label: 'Clases' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveSubTab(t.id)} className={`px-3 py-1.5 rounded-md transition-all font-bold text-[10px] uppercase tracking-widest ${activeSubTab === t.id ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'}`}>
              <t.icon size={14} className="inline mr-1.5" /> {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="animate-in fade-in duration-500">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'segmentation' && renderSegmentation()}
        {activeSubTab === 'users' && renderUsersList()}
        {activeSubTab === 'classes' && <AdminClassesView />}
      </div>
    </div>
  );
};

export default AdminControlView;
