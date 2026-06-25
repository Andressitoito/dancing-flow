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
      <div className="grid grid-cols-1 gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleOption(field, opt.id)}
            className={`flex items-center justify-between px-5 py-3 rounded-xl border text-left transition-all ${
              selected.includes(opt.id)
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-background/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="text-base font-medium">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={18} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="py-8 pb-32 md:pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto px-8 lg:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Mi Perfil</h1>
            {user?.isPro && (
                <span className="bg-primary text-background text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">PRO</span>
            )}
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-2"><BarChart size={16}/> Progreso del Perfil</span>
                <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
             </div>
             <div className="h-3 w-full max-w-md bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(244,114,182,0.4)]"
                  style={{ width: `${completion}%` }}
                />
             </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-primary text-background font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-base tracking-widest"
        >
          <Save size={24} />
          GUARDAR CAMBIOS
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Started */}
        <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <User size={22} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">¿Por qué empecé a bailar?</h2>
          </div>
          {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
        </section>

        {/* Objectives */}
        <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Target size={22} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">¿Cuáles son mis objetivos?</h2>
          </div>
          {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
        </section>

        {/* Hardest Part */}
        <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Zap size={22} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">¿Qué me cuesta más?</h2>
          </div>
          {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
        </section>

        {/* Fears */}
        <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <AlertTriangle size={22} />
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">¿Qué miedos tengo?</h2>
          </div>
          {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
        </section>

        {/* Aditional Details Section */}
        <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-xl md:col-span-2 space-y-8">
           <div className="flex items-center gap-4 text-primary">
              <Activity size={24} />
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Detalles Adicionales</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <BookOpen size={16}/> Nivel de Experiencia
                </label>
                <input
                  type="text"
                  value={formData.experienceLevel}
                  onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                  placeholder="¿Cuánto tiempo llevas bailando?"
                  className="w-full bg-background border border-white/10 rounded-2xl p-4 focus:border-primary transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <Music size={16}/> Estilos Preferidos
                </label>
                <input
                  type="text"
                  value={formData.preferredStyles}
                  onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                  placeholder="Bachata, Salsa, Contemporáneo..."
                  className="w-full bg-background border border-white/10 rounded-2xl p-4 focus:border-primary transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <Calendar size={16}/> Dedicación Semanal
                </label>
                <input
                  type="text"
                  value={formData.weeklyDedication}
                  onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                  placeholder="¿Cuántas horas o días a la semana?"
                  className="w-full bg-background border border-white/10 rounded-2xl p-4 focus:border-primary transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 !text-red-400">
                  <AlertTriangle size={16}/> Limitaciones Físicas o Lesiones
                </label>
                <input
                  type="text"
                  value={formData.physicalLimitations}
                  onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                  placeholder="Ej. Lesión en rodilla, espalda..."
                  className="w-full bg-background border border-white/10 rounded-2xl p-4 focus:border-red-400/50 transition-all shadow-inner"
                />
              </div>
           </div>
        </section>
      </div>

      {/* Recording Preferences */}
      <section className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-10">
        <div className="flex items-center gap-4 text-primary">
          <Video size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tight italic">Preferencias de Entrenamiento</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => {
            const isActive = formData.recordingPreference === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSingleOption('recordingPreference', opt.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isActive
                  ? 'bg-primary border-primary text-background shadow-lg scale-[1.03]'
                  : 'bg-background/40 border-white/5 text-zinc-400 hover:border-primary/30 hover:bg-background/60'
                }`}
              >
                <span className="font-bold text-base uppercase tracking-tight leading-tight">{opt.label}</span>
                {isActive && <CheckCircle2 size={24} className="ml-auto" />}
              </button>
            );
          })}
        </div>

        <div className="pt-10 border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 text-primary">
              <Activity size={22} />
              <h2 className="text-sm font-black uppercase tracking-[0.15em]">¿Cómo me siento hoy con el baile?</h2>
           </div>
           <textarea
              value={formData.personalFeeling}
              onChange={(e) => setFormData({...formData, personalFeeling: e.target.value})}
              placeholder="Comparte tus sensaciones personales..."
              className="w-full bg-background/50 border border-white/10 rounded-[1.5rem] p-6 text-base focus:border-primary outline-none min-h-[150px] transition-colors shadow-inner"
           />
        </div>

        <div className="pt-10 border-t border-white/5 space-y-6">
           <div className="flex items-center gap-3 text-secondary">
              <Award size={26} />
              <h2 className="text-xl font-black uppercase tracking-tight italic">Tu Testimonio para la Web</h2>
           </div>
           <p className="text-zinc-500 text-base font-medium">Tu opinión ayuda a otros alumnos a motivarse. ¡Cuéntanos tu experiencia!</p>
           <textarea
              value={formData.testimonial}
              onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
              placeholder="Escribe tu testimonio aquí..."
              className="w-full bg-background/50 border border-white/10 rounded-[1.5rem] p-6 text-base focus:border-secondary outline-none min-h-[120px] transition-colors shadow-inner"
           />
           <div className="flex items-center gap-6 bg-background/40 p-4 rounded-2xl w-fit border border-white/5">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Puntuación</span>
              <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                      <button
                          key={star}
                          onClick={() => setFormData({...formData, testimonialStars: star})}
                          className={`transition-all ${formData.testimonialStars >= star ? 'text-secondary scale-125' : 'text-zinc-800 hover:text-secondary/40'}`}
                      >
                          <Award size={28} fill={formData.testimonialStars >= star ? 'currentColor' : 'none'} />
                      </button>
                  ))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfileView;
