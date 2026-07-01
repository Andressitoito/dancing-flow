import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Target, Zap, Video, Award, Check, Activity, Star } from 'lucide-react';
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
      background: '#051424',
      color: '#D4AF37',
      customClass: { popup: 'glass-card border-primary/40' }
    });
  };

  const renderMultiSelect = (field, options) => {
    const selected = formData[field] ? formData[field].split(',') : [];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleOption(field, opt.id)}
            className={`flex items-center justify-between px-6 py-4 rounded glass-card text-left transition-all duration-300 border-none ${
              selected.includes(opt.id)
              ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)] scale-[1.02]'
              : 'bg-white/5 text-zinc-500 hover:bg-white/10'
            }`}
          >
            <span className="label-luxury !text-[10px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={16} strokeWidth={3} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12">
        <div className="space-y-4">
          <span className="label-luxury">Gestión Personal</span>
          <div className="flex items-center gap-6">
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold text-white italic uppercase tracking-tighter leading-none">Mi <span className="text-primary">Perfil</span></h1>
            {user?.isPro && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-4 py-1.5 rounded-full border border-primary/30 uppercase tracking-widest neon-gold">PRO</span>
            )}
          </div>
          <p className="font-sora text-zinc-500 text-lg font-light">Personaliza tu experiencia y objetivos de maestría.</p>
        </div>

        <div className="flex items-center gap-8 glass-card p-6 rounded-2xl">
           <div className="hidden sm:block w-48 space-y-3">
              <div className="flex justify-between label-luxury !text-[9px] !text-zinc-500">
                 <span>Progreso de Perfil</span>
                 <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <button onClick={handleSubmit} className="btn-primary h-14">
             Guardar
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1 */}
          <section className="glass-card p-8 md:p-12 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Target size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Objetivos de Baile</h3>
             </div>
             <div className="space-y-12">
                <div className="space-y-6">
                   <label className="label-luxury !text-zinc-500">¿Por qué empezaste?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-6">
                   <label className="label-luxury !text-zinc-500">Objetivos actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </section>

          {/* Section 2 */}
          <section className="glass-card p-8 md:p-12 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Zap size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Desafíos y Miedos</h3>
             </div>
             <div className="space-y-12">
                <div className="space-y-6">
                   <label className="label-luxury !text-zinc-500">¿Qué es lo que más te cuesta?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-6">
                   <label className="label-luxury !text-zinc-500">Miedos o barreras</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </section>

          {/* Section 3 */}
          <section className="glass-card p-8 md:p-12 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Activity size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Detalles Técnicos</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="label-luxury !text-zinc-500">Nivel de Experiencia</label>
                   <input
                      type="text"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                      placeholder="Ej. 6 meses, 2 años..."
                   />
                </div>
                <div className="space-y-4">
                   <label className="label-luxury !text-zinc-500">Estilos Preferidos</label>
                   <input
                      type="text"
                      value={formData.preferredStyles}
                      onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                      placeholder="Bachata, Salsa..."
                   />
                </div>
                <div className="md:col-span-2 space-y-4">
                   <label className="label-luxury !text-zinc-500">Dedicación Semanal</label>
                   <input
                      type="text"
                      value={formData.weeklyDedication}
                      onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                      placeholder="¿Cuántas horas o días a la semana?"
                   />
                </div>
                <div className="md:col-span-2 space-y-4">
                   <label className="label-luxury !text-red-500/60">Lesiones o Limitaciones</label>
                   <textarea
                      value={formData.physicalLimitations}
                      onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                      placeholder="Detalla cualquier limitación para adaptar tu entrenamiento..."
                      className="min-h-[120px]"
                   />
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-12">
          {/* Recording Pref */}
          <section className="glass-card p-8 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Video size={24} />
                </div>
                <h3 className="font-sora text-xl font-bold uppercase italic text-white">Grabación</h3>
             </div>
             <div className="space-y-3">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-6 py-4 rounded transition-all duration-300 border-none ${
                      formData.recordingPreference === opt.id
                      ? 'bg-primary/20 text-primary shadow-lg scale-[1.02]'
                      : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                  >
                    <span className="label-luxury !text-[9px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
                  </button>
                ))}
             </div>
          </section>

          {/* Testimonial */}
          <section className="glass-card p-8 space-y-10">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Award size={24} />
                </div>
                <h3 className="font-sora text-xl font-bold uppercase italic text-white">Testimonio</h3>
             </div>
             <div className="space-y-8">
                <div className="space-y-4">
                    <label className="label-luxury !text-zinc-500">Tu Mensaje Público</label>
                    <textarea
                       value={formData.testimonial}
                       onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                       placeholder="Comparte tu evolución con la comunidad..."
                       className="min-h-[160px]"
                    />
                </div>
                <div className="space-y-6">
                   <span className="label-luxury !text-zinc-500 text-center block">Calificación</span>
                   <div className="flex gap-4 justify-center bg-black/40 py-6 rounded border border-primary/10">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all duration-300 hover:scale-125 ${formData.testimonialStars >= star ? 'text-primary' : 'text-zinc-900'}`}
                           >
                               <Star size={24} fill={formData.testimonialStars >= star ? 'currentColor' : 'none'} />
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
