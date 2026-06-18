import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Users, Filter, BookOpen, MessageCircle, BarChart3, Trash2, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../services/constants';
import Swal from 'sweetalert2';
import AdminClassesView from './AdminClassesView';

const AdminControlView = () => {
  const { users, fetchInitialData } = useStore();
  const [activeSubTab, setActiveSubTab] = useState('stats');

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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
      await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
      fetchInitialData();
    }
  };

  const renderStats = () => {
    const total = users.length;
    const males = users.filter(u => u.gender === 'male').length;
    const females = users.filter(u => u.gender === 'female').length;
    const other = total - males - females;

    const levels = {
      principiante: users.filter(u => u.level === 'principiante').length,
      'pre-intermedio': users.filter(u => u.level === 'pre-intermedio').length,
      intermedio: users.filter(u => u.level === 'intermedio').length,
      avanzado: users.filter(u => u.level === 'avanzado').length,
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-outline">
            <p className="text-[10px] font-black text-zinc-500 uppercase">Total Usuarios</p>
            <p className="text-3xl font-black text-primary italic">{total}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-outline">
            <p className="text-[10px] font-black text-zinc-500 uppercase">Mujeres</p>
            <p className="text-3xl font-black text-pink-500 italic">{females}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-outline">
            <p className="text-[10px] font-black text-zinc-500 uppercase">Hombres</p>
            <p className="text-3xl font-black text-blue-500 italic">{males}</p>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-outline">
            <p className="text-[10px] font-black text-zinc-500 uppercase">Otros/Sin ID</p>
            <p className="text-3xl font-black text-zinc-400 italic">{other}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-outline space-y-4">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={14} /> Niveles de Alumnos
          </h3>
          {Object.entries(levels).map(([lvl, count]) => (
            <div key={lvl} className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{lvl}</span>
                <span>{count}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSegmentation = () => {
    const preferences = [
      { id: 'alone', label: 'Quieren grabar solos' },
      { id: 'couple', label: 'Quieren grabar en pareja' },
      { id: 'show', label: 'Quieren hacer shows' },
    ];

    return (
      <div className="space-y-6">
        {preferences.map(pref => {
          const filteredUsers = users.filter(u => u.Questionnaire?.recordingPreference === pref.id);
          const males = filteredUsers.filter(u => u.gender === 'male');
          const females = filteredUsers.filter(u => u.gender === 'female');

          return (
            <div key={pref.id} className="bg-surface p-4 rounded-3xl border border-outline">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-primary uppercase">{pref.label}</h3>
                <span className="text-xs font-bold bg-background px-2 py-1 rounded-lg border border-outline">
                  {filteredUsers.length} ({males.length}H / {females.length}M)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {males.map(u => <p key={u.id} className="text-xs text-blue-400 font-medium">· {u.username}</p>)}
                </div>
                <div className="space-y-1">
                  {females.map(u => <p key={u.id} className="text-xs text-pink-400 font-medium">· {u.username}</p>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderUsersList = () => (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="bg-surface p-3 rounded-2xl border border-outline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-zinc-500" />
            </div>
            <div>
              <p className="font-bold text-sm">{u.username}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-black">{u.level} · {u.gender}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                <ShieldAlert size={18} />
             </button>
             <button
                onClick={() => handleDeleteUser(u.id)}
                className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
             >
                <Trash2 size={18} />
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  const subTabs = [
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'segmentation', icon: Filter, label: 'Filtros' },
    { id: 'users', icon: Users, label: 'Alumnos' },
    { id: 'classes', icon: BookOpen, label: 'Clases' }
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary italic uppercase leading-none">Dashboard</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase mt-1">Control de Academia</p>
        </div>
        <div className="flex gap-1 bg-surface border border-outline p-1 rounded-2xl">
          {subTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`p-2 rounded-xl transition-all ${activeSubTab === t.id ? 'bg-primary text-background' : 'text-zinc-500'}`}
            >
              <t.icon size={18} />
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
