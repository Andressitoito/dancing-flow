import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Users, Filter, BookOpen, BarChart3, Trash2, Search, X, Check, Eye } from 'lucide-react';
import { API_BASE_URL, QUESTIONNAIRE_OPTIONS } from '../services/constants';
import Swal from 'sweetalert2';
import AdminClassesView from './AdminClassesView';

const AdminControlView = () => {
  const { user: currentUser, users, fetchInitialData } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-profesor-id': currentUser.id }
      });
      fetchInitialData();
    }
  };

  const handleTogglePro = async (user) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-profesor-id': currentUser.id
        },
        body: JSON.stringify({ isPro: !user.isPro })
      });
      if (res.ok) fetchInitialData();
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
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Usuarios', value: total, color: 'text-primary', icon: Users },
            { label: 'Mujeres', value: females, color: 'text-pink-500', icon: Users },
            { label: 'Hombres', value: males, color: 'text-blue-500', icon: Users },
            { label: 'Sin Identificar', value: unidentified, color: 'text-zinc-500', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-glass backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <stat.icon size={20} className={`${stat.color} mb-4`} />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-5xl font-black ${stat.color} italic tracking-tighter mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSegmentation = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(pref => {
          const filteredUsers = users.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filteredUsers.filter(u => u.gender === 'male');
          const females = filteredUsers.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="bg-surface-glass backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black text-primary uppercase italic leading-none">{pref.label}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest">
                        {filteredUsers.length} TOTAL · {males.length}H / {females.length}M
                    </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-blue-500/50 uppercase tracking-widest border-b border-blue-500/10 pb-1">Hombres</p>
                  {males.map(u => (
                    <button
                        key={u.id}
                        onClick={() => setViewingUser(u)}
                        className="w-full text-left text-sm text-white font-medium hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {u.username}
                        <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-pink-500/50 uppercase tracking-widest border-b border-pink-500/10 pb-1">Mujeres</p>
                  {females.map(u => (
                    <button
                        key={u.id}
                        onClick={() => setViewingUser(u)}
                        className="w-full text-left text-sm text-white font-medium hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        {u.username}
                        <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Buscar alumno por nombre..."
          className="w-full bg-surface-glass border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-lg"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(u => (
            <div key={u.id} className="bg-surface-glass backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all group">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-black italic text-zinc-600">
                        {u.username[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">{u.username}</h3>
                            {u.isPro && (
                                <span className="bg-primary text-background text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">PRO</span>
                            )}
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${u.role === 'profesor' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                                {u.role}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                            {u.level || 'Sin Nivel'} · {u.gender}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
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
        const opt = QUESTIONNAIRE_OPTIONS[field].find(o => o.id === id);
        return opt ? opt.label : id;
    }).join(', ');
  };

  if (viewingUser) {
    return (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto animate-in slide-in-from-bottom duration-500">
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500">
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Perfil de {viewingUser.username}</h2>
                </div>
            </header>
            <div className="p-8 pb-32">
                 <div className="max-w-4xl mx-auto bg-surface p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">¿Por qué empezó?</h4>
                            <p className="text-white text-lg font-medium">{getLabels('whyStarted', viewingUser.Questionnaire?.whyStarted)}</p>
                        </section>
                        <section>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Objetivos</h4>
                            <p className="text-white text-lg font-medium">{getLabels('objectives', viewingUser.Questionnaire?.objectives)}</p>
                        </section>
                        <section>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Dificultades</h4>
                            <p className="text-white text-lg font-medium">{getLabels('hardestPart', viewingUser.Questionnaire?.hardestPart)}</p>
                        </section>
                        <section>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Miedos</h4>
                            <p className="text-white text-lg font-medium">{getLabels('fears', viewingUser.Questionnaire?.fears)}</p>
                        </section>
                    </div>

                    <div className="pt-12 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Preferencia de Grabación</h4>
                        <div className="inline-flex items-center gap-4 bg-background px-8 py-4 rounded-2xl border border-white/10 text-white font-black uppercase italic">
                            <Check className="text-primary" />
                            {getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}
                        </div>
                    </div>
                 </div>
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
    <div className="py-10 px-4 md:px-0">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 max-w-7xl mx-auto">
        <div>
          <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Panel de Profesor</h1>
          <p className="text-zinc-500 text-lg font-medium mt-2">Gestiona tu comunidad y personaliza el aprendizaje.</p>
        </div>

        <div className="flex gap-2 bg-surface-glass backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl">
          {subTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                activeSubTab === t.id
                ? 'bg-primary text-background shadow-lg scale-105'
                : 'text-zinc-500 hover:text-white'
              }`}
            >
              <t.icon size={18} />
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
