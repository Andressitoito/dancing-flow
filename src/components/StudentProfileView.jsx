import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Save, CheckCircle2, User, Target, Zap, AlertTriangle, Video, Award, Check, BarChart, BookOpen, Music, Calendar, Activity, Star } from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';
import { api } from '../services/api';
import Swal from 'sweetalert2';

const StudentProfileView = () => {
  const { user, questionnaire, updateQuestionnaire } = useStore();
  const [formData, setFormData] = useState({
    whyStarted: '',
    objectives: '',
    hardestPart: '',
    fears: '',
    recordingPreference: 'alone',
    personalFeeling: '',
    experienceLevel: '',
    preferredStyles: '',
    weeklyDedication: '',
    physicalLimitations: '',
    testimonial: '',
    testimonialStars: 5
  });

  useEffect(() => {
    const refreshData = async () => {
      try {
        const quest = await api.getQuestionnaire();
        if (quest && !quest.error) {
           setFormData({
            whyStarted: quest.whyStarted || '',
            objectives: quest.objectives || '',
            hardestPart: quest.hardestPart || '',
            fears: quest.fears || '',
            recordingPreference: quest.recordingPreference || 'alone',
            personalFeeling: quest.personalFeeling || '',
            experienceLevel: quest.experienceLevel || '',
            preferredStyles: quest.preferredStyles || '',
            weeklyDedication: quest.weeklyDedication || '',
            physicalLimitations: quest.physicalLimitations || '',
            testimonial: quest.testimonial || '',
            testimonialStars: quest.testimonialStars || 5
          });
        }
      } catch (e) {
        console.error("Error refreshing questionnaire:", e);
      }
    };
    refreshData();
  }, []);

  const toggleOption = (field, optionId) => {
    let current = formData[field] ? formData[field].split(',') : [];
    if (current.includes(optionId)) {
      current = current.filter(id => id !== optionId);
    } else {
      current.push(optionId);
    }
    setFormData({ ...formData, [field]: current.join(',') });
  };

  const setSingleOption = (field, optionId) => {
    setFormData({ ...formData, [field]: optionId });
  };

  const handleSubmit = async () => {
    await updateQuestionnaire(formData);
    Swal.fire({
      icon: 'success',
      title: 'Perfil Actualizado',
      text: 'Tus objetivos se han guardado correctamente.',
      timer: 1500,
      showConfirmButton: false,
      background: '#18181b',
      color: '#fff',
      customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl bg-surface-glass/90' }
    });
  };

  const renderMultiSelect = (field, options) => {
    const selected = formData[field] ? formData[field].split(',') : [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleOption(field, opt.id)}
            className={`flex items-center justify-between px-5 py-3 rounded-xl border text-left transition-all duration-300 ${
              selected.includes(opt.id)
              ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(244,114,182,0.15)] scale-[1.02]'
              : 'bg-zinc-950/50 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-zinc-900/50'
            }`}
          >
            <span className="text-sm font-bold tracking-tight uppercase">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={16} strokeWidth={3} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Refined Premium Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Gestión Personal</p>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Mi <span className="text-primary">Perfil</span></h1>
            {user?.isPro && (
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/30 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(244,114,182,0.15)]">PRO</span>
            )}
          </div>
          <p className="text-zinc-500 text-base font-medium opacity-60">Personaliza tu experiencia y objetivos en Dancing Flow.</p>
        </div>

        <div className="flex items-center gap-8 bg-surface-glass/40 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] border border-white/5 shadow-xl">
           <div className="hidden sm:block w-48 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <span>Progreso</span>
                 <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
              </div>
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(244,114,182,0.5)]" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <button onClick={handleSubmit} className="px-8 py-4 bg-primary text-background font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/20">
             Guardar Cambios
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Sections */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface-glass/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Target size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Objetivos de Baile</h3>
             </div>
             <div className="space-y-10">
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">¿Por qué empezaste?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Objetivos actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </section>

          <section className="bg-surface-glass/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Desafíos y Miedos</h3>
             </div>
             <div className="space-y-10">
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">¿Qué es lo que más te cuesta?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Miedos o barreras</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </section>

          <section className="bg-surface-glass/20 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Activity size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Detalles de Entrenamiento</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Nivel de Experiencia</label>
                   <input
                      type="text"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                      placeholder="Ej. 6 meses, 2 años..."
                      className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-4 px-6 focus:border-primary/50 transition-all text-lg"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Estilos Preferidos</label>
                   <input
                      type="text"
                      value={formData.preferredStyles}
                      onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                      placeholder="Bachata, Salsa..."
                      className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-4 px-6 focus:border-primary/50 transition-all text-lg"
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Dedicación Semanal</label>
                   <input
                      type="text"
                      value={formData.weeklyDedication}
                      onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                      placeholder="¿Cuántas horas o días a la semana?"
                      className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-4 px-6 focus:border-primary/50 transition-all text-lg"
                   />
                </div>
                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-black uppercase tracking-[0.3em] text-red-400/80">Lesiones o Limitaciones Físicas</label>
                   <textarea
                      value={formData.physicalLimitations}
                      onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                      placeholder="Ej. Rodilla derecha, espalda baja..."
                      className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-4 px-6 focus:border-primary/50 transition-all text-lg min-h-[100px]"
                   />
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          <section className="bg-surface-glass/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Video size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Grabación</h3>
             </div>
             <div className="space-y-3">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-500 ${
                      formData.recordingPreference === opt.id
                      ? 'bg-primary/20 border-primary text-primary shadow-2xl shadow-primary/10 scale-[1.03]'
                      : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/10'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em] leading-none">{opt.label}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="bg-surface-glass/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Award size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Feedback Web</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Tu Testimonio Público</label>
                    <textarea
                       value={formData.testimonial}
                       onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                       placeholder="Comparte tu experiencia con la comunidad..."
                       className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-4 px-6 focus:border-primary/50 transition-all text-base min-h-[140px]"
                    />
                </div>
                <div className="flex flex-col gap-4">
                   <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Calificación</span>
                   <div className="flex gap-3 justify-center bg-black/40 py-4 rounded-2xl border border-white/5">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all duration-300 hover:scale-125 ${formData.testimonialStars >= star ? 'text-primary' : 'text-zinc-800'}`}
                           >
                               <Star size={28} fill={formData.testimonialStars >= star ? 'currentColor' : 'none'} strokeWidth={2} />
                           </button>
                       ))}
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
