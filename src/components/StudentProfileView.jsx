import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Save, CheckCircle2, User, Target, Zap, AlertTriangle, Video, Award, Check, BarChart, BookOpen, Music, Calendar, Activity } from 'lucide-react';
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

  // Re-fetch data on mount to ensure fresh questionnaire state
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
      title: '¡Perfil Actualizado!',
      text: 'Tus profesores ya pueden ver tus nuevos objetivos.',
      timer: 2000,
      showConfirmButton: false,
      background: '#18181b',
      color: '#fff',
      customClass: {
        popup: 'rounded-3xl border border-primary/20'
      }
    });
  };

  const renderMultiSelect = (field, options) => {
    const selected = formData[field] ? formData[field].split(',') : [];
    return (
      <div className="grid grid-cols-1 gap-1.5">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleOption(field, opt.id)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              selected.includes(opt.id)
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-background/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="text-xs font-medium">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={14} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="py-8 pb-32 md:pb-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-4 md:px-8 lg:px-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Mi Perfil</h1>
            {user?.isPro && (
                <span className="bg-primary text-background text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest animate-pulse">PRO</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">
                <span className="flex items-center gap-1"><BarChart size={12}/> Progreso del Perfil</span>
                <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
             </div>
             <div className="h-2 w-full max-w-xs bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                  style={{ width: `${completion}%` }}
                />
             </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary text-background font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Save size={20} />
          GUARDAR CAMBIOS
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why Started */}
        <section className="space-y-3 bg-surface-glass backdrop-blur-xl p-5 lg:p-6 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <User size={18} />
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">¿Por qué empecé a bailar?</h2>
          </div>
          {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
        </section>

        {/* Objectives */}
        <section className="space-y-3 bg-surface-glass backdrop-blur-xl p-5 lg:p-6 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Target size={18} />
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">¿Cuáles son mis objetivos?</h2>
          </div>
          {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
        </section>

        {/* Hardest Part */}
        <section className="space-y-3 bg-surface-glass backdrop-blur-xl p-5 lg:p-6 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap size={18} />
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">¿Qué me cuesta más?</h2>
          </div>
          {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
        </section>

        {/* Fears */}
        <section className="space-y-3 bg-surface-glass backdrop-blur-xl p-5 lg:p-6 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <AlertTriangle size={18} />
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">¿Qué miedos tengo?</h2>
          </div>
          {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
        </section>

        {/* --- NEW QUESTIONS --- */}
        <section className="space-y-4 bg-surface-glass backdrop-blur-xl p-5 lg:p-6 rounded-[1.5rem] border border-white/5 shadow-2xl md:col-span-2">
           <div className="flex items-center gap-3 text-primary mb-2">
              <Activity size={20} />
              <h2 className="text-lg font-black uppercase tracking-[0.1em] italic">Detalles Adicionales</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <BookOpen size={12}/> Nivel de Experiencia
                </label>
                <input
                  type="text"
                  value={formData.experienceLevel}
                  onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                  placeholder="¿Cuánto tiempo llevas bailando?"
                  className="w-full bg-background border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Music size={12}/> Estilos Preferidos
                </label>
                <input
                  type="text"
                  value={formData.preferredStyles}
                  onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                  placeholder="Bachata, Salsa, Contemporáneo..."
                  className="w-full bg-background border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Calendar size={12}/> Dedicación Semanal
                </label>
                <input
                  type="text"
                  value={formData.weeklyDedication}
                  onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                  placeholder="¿Cuántas horas o días a la semana?"
                  className="w-full bg-background border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-red-500/50 flex items-center gap-2">
                  <AlertTriangle size={12}/> Limitaciones Físicas o Lesiones
                </label>
                <input
                  type="text"
                  value={formData.physicalLimitations}
                  onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                  placeholder="Ej. Lesión en rodilla, espalda..."
                  className="w-full bg-background border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-red-500/50 transition-all"
                />
              </div>
           </div>
        </section>
      </div>

      {/* Recording Preferences */}
      <section className="px-4 md:px-0">
        <div className="bg-surface-glass backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-6">
            <Video size={24} />
            <h2 className="text-lg font-black uppercase tracking-[0.15em] italic">Preferencias de Entrenamiento</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => {
              const isActive = formData.recordingPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSingleOption('recordingPreference', opt.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    isActive
                    ? 'bg-primary border-primary text-background shadow-lg scale-[1.02]'
                    : 'bg-background/40 border-white/5 text-zinc-400 hover:border-primary/30 hover:bg-background/60'
                  }`}
                >
                  <span className="font-bold text-xs uppercase tracking-tight">{opt.label}</span>
                  {isActive && <CheckCircle2 size={18} className="ml-auto" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
             <div className="flex items-center gap-3 text-primary mb-2">
                <Target size={20} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">¿Cómo me siento hoy con el baile?</h2>
             </div>
             <textarea
                value={formData.personalFeeling}
                onChange={(e) => setFormData({...formData, personalFeeling: e.target.value})}
                placeholder="Comparte tus sensaciones personales..."
                className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-sm focus:border-primary outline-none min-h-[100px] transition-colors"
             />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
             <div className="flex items-center gap-3 text-secondary mb-2">
                <Award size={20} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Tu Testimonio para la Web</h2>
             </div>
             <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-1">Tu opinión ayuda a otros alumnos a motivarse. ¡Cuéntanos tu experiencia!</p>
             <textarea
                value={formData.testimonial}
                onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                placeholder="Escribe tu testimonio aquí..."
                className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-sm focus:border-secondary outline-none min-h-[80px] transition-colors"
             />
             <div className="flex items-center gap-4 px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Puntuación:</span>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => setFormData({...formData, testimonialStars: star})}
                            className={`transition-all ${formData.testimonialStars >= star ? 'text-secondary scale-110' : 'text-zinc-800 hover:text-secondary/40'}`}
                        >
                            <Award size={20} fill={formData.testimonialStars >= star ? 'currentColor' : 'none'} />
                        </button>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfileView;
