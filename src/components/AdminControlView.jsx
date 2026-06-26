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
      <div className="space-y-10">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Alumnos', value: total, icon: 'person', color: 'text-primary' },
            { label: 'Comunidad Femenina', value: females, icon: 'female', color: 'text-primary' },
            { label: 'Comunidad Masculina', value: males, icon: 'male', color: 'text-zinc-400' },
            { label: 'No Identificados', value: unidentified, icon: 'help', color: 'text-zinc-600' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:border-primary transition-all duration-300">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
                <span className="text-title-sm text-zinc-500 tracking-[0.15em] uppercase mb-2">{stat.label}</span>
                <span className="text-headline-lg text-primary kinetic-italic leading-none">{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Main Content Canvas */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel: Activity Chart */}
          <div className="lg:col-span-8 glass-card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-title-sm uppercase tracking-wider text-white">Actividad Semanal</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-label-sm text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-primary"></span> Bachata
                </span>
                <span className="flex items-center gap-2 text-label-sm text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Salsa
                </span>
              </div>
            </div>
            <div className="relative h-[300px] w-full p-6 overflow-hidden">
              <div className="absolute inset-x-6 bottom-10 h-48 flex items-end justify-between gap-4">
                {[
                  { p: 'h-3/4', s: 'h-1/2' },
                  { p: 'h-2/3', s: 'h-1/3' },
                  { p: 'h-5/6', s: 'h-2/3' },
                  { p: 'h-1/2', s: 'h-1/4' },
                  { p: 'h-4/5', s: 'h-3/5' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group">
                    <div className={`absolute bottom-0 w-full bg-primary ${bar.p} rounded-t-sm transition-all duration-500 hover:brightness-110`}></div>
                    <div className={`absolute bottom-0 w-full bg-zinc-400 ${bar.s} rounded-t-sm opacity-60`}></div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-6 bottom-4 flex justify-between text-label-sm text-zinc-600 uppercase tracking-tighter">
                <span>Lunes</span><span>Martes</span><span>Miércoles</span><span>Jueves</span><span>Viernes</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Upcoming Classes */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass-card p-6 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-title-sm uppercase tracking-wider text-white">Próximas Clases</h3>
                <span className="material-symbols-outlined text-primary cursor-pointer hover:rotate-90 transition-transform">sync</span>
              </div>
              <div className="space-y-4">
                {[
                  { day: '14', month: 'Mar', title: 'Bachata Sensual III', time: '19:30', room: 'Studio A' },
                  { day: '15', month: 'Mie', title: 'Salsa On2 Advanced', time: '21:00', room: 'Main Hall' }
                ].map((clase, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded bg-black/40 flex flex-col items-center justify-center border border-white/10 shrink-0">
                      <span className="text-label-sm text-primary uppercase leading-none">{clase.month}</span>
                      <span className="text-body-lg font-bold text-white leading-none mt-1">{clase.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-md text-white truncate">{clase.title}</p>
                      <p className="text-label-sm text-zinc-500 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined !text-[14px]">schedule</span> {clase.time} - {clase.room}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-zinc-600 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 border border-white/10 py-2 rounded text-label-md text-zinc-400 hover:bg-primary/10 hover:text-primary transition-all">
                Ver Agenda Completa
              </button>
            </div>

            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-primary to-amber-700 rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden group">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 !text-[120px] opacity-10 group-hover:rotate-12 transition-transform text-white">grade</span>
              <h4 className="text-headline-md text-black kinetic-italic leading-tight">Nueva<br/>Inscripción</h4>
              <p className="text-label-md text-black/70 max-w-[140px]">Agrega un nuevo talento a la comunidad hoy mismo.</p>
              <button className="mt-4 bg-black text-primary w-fit px-6 py-2 rounded-xl text-label-md font-bold hover:scale-105 active:scale-95 transition-all">
                Registrar
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Segmentation Section */}
        <section>
          <h3 className="text-title-sm uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-4">
            Segmentación Detallada <div className="h-px flex-1 bg-white/10"></div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level of Mastery */}
            <div className="glass-card p-6">
              <p className="text-label-md text-zinc-500 mb-6 uppercase tracking-widest">Nivel de Dominio</p>
              <div className="space-y-6">
                {[
                  { label: 'Iniciado', value: 45, color: 'bg-primary' },
                  { label: 'Intermedio', value: 38, color: 'bg-zinc-400' },
                  { label: 'Avanzado', value: 17, color: 'bg-green-500' }
                ].map((level, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-body-md text-white">{level.label}</span>
                      <span className={`text-label-md ${level.label === 'Iniciado' ? 'text-primary' : 'text-white'}`}>{level.value}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${level.color}`} style={{ width: `${level.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention */}
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <p className="text-label-md text-zinc-500 mb-6 uppercase tracking-widest">Retención Mensual</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-display-lg text-white kinetic-italic">94%</span>
                  <span className="text-green-500 flex items-center text-label-md font-bold">
                    <span className="material-symbols-outlined !text-[16px]">trending_up</span> +2.4%
                  </span>
                </div>
                <p className="text-label-sm text-zinc-400">Excelente tasa de permanencia comparado al mes anterior.</p>
              </div>
              <div className="mt-8 h-12 flex items-center justify-center bg-white/5 rounded border border-dashed border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                <span className="text-label-sm text-zinc-500 group-hover:text-primary">Reporte de Deserción</span>
              </div>
            </div>

            {/* Gallery Card */}
            <div className="glass-card overflow-hidden group cursor-pointer relative min-h-[240px]">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0bwlYy9khgvPzUA0nKRcuTuAWlKZco-_NBCp3hqKb8znB7XM47pG4nNHPhuLXh8q24Tk0J1DtL9eKFO_jd-YA5Et4QnwDZOUhLUHg49FYbj2eT5i44CW2CxsieL0SuQTzBqLb1ftLQc_3whZrjr3szRhxnLS4Mj1oBVLpQIc3yVjO8r6n0t11Cui3OqjGBwsXaOKcjppmaUy9x1cBahIFxb2uEdadoYEBYURDpZMKq7Kvx-4X57Z_JhVn5uknwdDjSOqcPtAQF3sF"
                alt="Workshop Madrid 2024"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-title-sm text-primary uppercase">Nueva Galería</span>
                <h4 className="text-headline-md text-white kinetic-italic leading-tight">Workshop<br/>Madrid 2024</h4>
              </div>
            </div>
          </div>
        </section>
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
            <div key={pref.id} className="glass-card p-6 space-y-6 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                 <span className="material-symbols-outlined !text-[80px]">filter_list</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                  <div>
                    <h3 className="text-headline-md text-white uppercase italic leading-none">{pref.label}</h3>
                    <p className="text-label-sm text-zinc-500 mt-2 tracking-widest uppercase">Segmentación de Privacidad</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg border border-primary/20 text-primary flex items-center justify-center text-label-md font-bold italic">
                    {filtered.length}
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="material-symbols-outlined !text-[16px]">male</span>
                    <span className="text-label-sm tracking-widest uppercase">HOMBRES ({males.length})</span>
                  </div>
                  <div className="space-y-2">
                    {males.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-body-md text-zinc-500 hover:text-primary transition-all flex items-center gap-3 bg-black/20 p-2 rounded border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                          <span className="truncate italic font-bold uppercase">{u.username}</span>
                      </button>
                    ))}
                    {males.length > 5 && <p className="text-label-sm text-zinc-700 font-bold italic ml-2">... Y {males.length - 5} MÁS</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined !text-[16px]">female</span>
                    <span className="text-label-sm tracking-widest uppercase text-primary">MUJERES ({females.length})</span>
                  </div>
                  <div className="space-y-2">
                    {females.slice(0, 5).map(u => (
                      <button key={u.id} onClick={() => setViewingUser(u)} className="w-full text-left text-body-md text-zinc-500 hover:text-primary transition-all flex items-center gap-3 bg-black/20 p-2 rounded border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span className="truncate italic font-bold uppercase">{u.username}</span>
                      </button>
                    ))}
                    {females.length > 5 && <p className="text-label-sm text-zinc-700 font-bold italic ml-2">... Y {females.length - 5} MÁS</p>}
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
    <div className="space-y-6">
      <section className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre de alumno..."
            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-md text-white placeholder:text-zinc-700 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 h-12 rounded-xl border border-white/5">
            <span className="text-label-sm text-zinc-500 tracking-[0.2em] uppercase">TOTAL REGISTRADOS</span>
            <div className="text-primary font-bold italic text-body-lg">
                {filteredUsers.length}
            </div>
        </div>
      </section>

      <section className="glass-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_120px_120px_180px] gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-label-sm text-zinc-500 uppercase tracking-widest">
          <div></div>
          <div>Identidad</div>
          <div className="hidden md:block">Evolución</div>
          <div className="hidden md:block">Estatus</div>
          <div className="text-right">Gestión</div>
        </div>

        {/* List Container */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredUsers.map(u => (
              <div key={u.id} className="grid grid-cols-[48px_1fr_120px_120px_180px] gap-4 px-6 py-3 items-center hover:bg-white/5 transition-all duration-300 border-b border-white/5 group">
                  <div className="w-10 h-10 rounded-lg bg-black/60 flex items-center justify-center font-bold text-primary/40 italic border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all">
                      {u.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                      <div className="flex items-center gap-2">
                          <p className="text-body-lg font-bold italic text-white uppercase truncate group-hover:text-primary transition-colors leading-none">{u.username}</p>
                          {u.isPro && <span className="bg-primary text-black text-label-sm font-black px-2 py-0.5 rounded italic uppercase">PRO</span>}
                      </div>
                      <p className="text-label-sm text-zinc-500 uppercase mt-1 font-bold md:hidden">{u.level || 'Principiante'} • {u.role}</p>
                  </div>
                  <div className="hidden md:block text-label-md text-zinc-400 italic font-bold">{u.level || 'Principiante'}</div>
                  <div className={`hidden md:block text-label-sm font-bold tracking-widest uppercase ${u.role === 'profesor' ? 'text-primary' : 'text-zinc-500'}`}>
                    {u.role === 'profesor' ? 'MASTER' : 'ALUMNO'}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                      {u.role === 'alumno' && (
                          <button
                              onClick={() => handleTogglePro(u)}
                              className={`hidden lg:block text-[10px] font-bold border px-3 py-1.5 rounded transition-all duration-300 ${
                                  u.isPro
                                  ? 'bg-primary/10 border-primary text-primary active-glow'
                                  : 'border-white/10 text-zinc-600 hover:border-primary hover:text-primary'
                              }`}
                          >
                              {u.isPro ? 'PRO' : 'HACER PRO'}
                          </button>
                      )}
                      <button onClick={() => setViewingUser(u)} className="w-9 h-9 rounded bg-black/40 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all">
                        <span className="material-symbols-outlined !text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="w-9 h-9 rounded bg-black/40 border border-white/5 flex items-center justify-center text-zinc-800 hover:text-red-500 hover:border-red-500 transition-all">
                        <span className="material-symbols-outlined !text-[18px]">delete</span>
                      </button>
                  </div>
              </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center opacity-30">
               <span className="material-symbols-outlined !text-[48px] mb-4">search_off</span>
               <p className="text-label-md uppercase font-bold italic">No se encontraron alumnos</p>
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
                                <span className="label-luxury text-zinc-600 block mb-2">Dedicación</span>
                                <p className="font-sora text-xl text-white font-black italic uppercase tracking-tight">{viewingUser.Questionnaire?.weeklyDedication || '---'}</p>
                             </div>
                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                                <span className="label-luxury text-zinc-600 block mb-2">Preferencia</span>
                                <p className="font-sora text-base text-primary font-black italic uppercase tracking-tighter leading-none">{getLabels('recordingPreference', viewingUser.Questionnaire?.recordingPreference)}</p>
                             </div>
                             <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-center">
                                <span className="label-luxury text-zinc-600 block mb-2">Nivel Base</span>
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
    <div className="pb-20 max-w-[1440px] mx-auto px-4 md:px-16">
      <header className="py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-title-sm text-primary uppercase tracking-[0.2em]">Administración Academy</span>
            <h1 className="text-display-lg kinetic-italic text-white flex items-baseline gap-2">
              PANEL <span className="text-label-md text-primary uppercase tracking-widest italic opacity-80 font-bold">Profesor</span>
            </h1>
            <p className="text-body-md text-zinc-400 max-w-xl">Control general de la comunidad, estadísticas y segmentación de alumnos en tiempo real.</p>
          </div>

          {/* View Switcher */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 h-fit">
            {[
              { id: 'stats', icon: 'equalizer', label: 'STATS' },
              { id: 'segmentation', icon: 'filter_list', label: 'SEGS' },
              { id: 'users', icon: 'groups', label: 'ALUMS' },
              { id: 'classes', icon: 'school', label: 'CLASES' }
            ].map(t => (
              <button
                  key={t.id}
                  onClick={() => setActiveSubTab(t.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg transition-all duration-300 text-label-md ${
                      activeSubTab === t.id
                      ? 'bg-primary text-black font-bold active-glow'
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined !text-[18px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
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
