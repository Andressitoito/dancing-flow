import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
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
      } catch (e) { console.error(e); }
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
      timer: 1500,
      showConfirmButton: false,
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
            className={`flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 border text-left ${
              selected.includes(opt.id)
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <span className="label-luxury !text-[9px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
            {selected.includes(opt.id) && <span className="material-symbols-outlined !text-[16px]">check</span>}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10">
        <div>
          <span className="label-luxury !text-[10px] !text-primary !mb-2">Membresía Activa</span>
          <div className="flex items-baseline gap-4">
            <h1 className="font-sora text-[40px] md:text-[64px] font-extrabold text-white italic uppercase tracking-tighter leading-[0.9]">
              MI <span className="text-primary">PERFIL</span>
            </h1>
            {user?.isPro && (
                <span className="bg-primary text-black text-[10px] font-black px-3 py-0.5 rounded italic uppercase tracking-tighter kinetic-skew">PRO</span>
            )}
          </div>
          <p className="font-sora text-zinc-500 text-sm font-light mt-4 max-w-xl">
            Gestiona tus metas, preferencias y evolución técnica dentro de la academia.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-surface-container p-6 rounded-2xl border border-white/5 shadow-2xl">
           <div className="hidden sm:block w-48 space-y-3">
              <div className="flex justify-between label-luxury !text-[9px] !text-zinc-400">
                 <span>PROGRESO PERFIL</span>
                 <span className={completion === 100 ? 'text-primary font-bold' : ''}>{completion}%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-all duration-1000 ease-out" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <button onClick={handleSubmit} className="btn-primary !h-12 !px-10 !text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
             Guardar Cambios
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Objectives */}
          <section className="bg-surface-container rounded-3xl p-8 md:p-10 space-y-10 border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <span className="material-symbols-outlined !text-[120px]">target</span>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-[20px]">ads_click</span>
                </div>
                <h3 className="font-sora text-2xl font-extrabold uppercase italic text-white tracking-tighter">Propósito y Metas</h3>
             </div>
             <div className="space-y-10 relative z-10">
                <div className="space-y-6">
                   <label className="label-luxury !text-[9px] !text-zinc-500 border-l-2 border-primary/30 pl-3">¿Qué te impulsó a comenzar?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-6">
                   <label className="label-luxury !text-[9px] !text-zinc-500 border-l-2 border-primary/30 pl-3">Tus objetivos actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </section>

          {/* Challenges */}
          <section className="bg-surface-container rounded-3xl p-8 md:p-10 space-y-10 border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <span className="material-symbols-outlined !text-[120px]">bolt</span>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-[20px]">fitness_center</span>
                </div>
                <h3 className="font-sora text-2xl font-extrabold uppercase italic text-white tracking-tighter">Desafíos Técnicos</h3>
             </div>
             <div className="space-y-10 relative z-10">
                <div className="space-y-6">
                   <label className="label-luxury !text-[9px] !text-zinc-500 border-l-2 border-primary/30 pl-3">¿Cuáles son tus mayores obstáculos?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-6">
                   <label className="label-luxury !text-[9px] !text-zinc-500 border-l-2 border-primary/30 pl-3">Barreras psicológicas o miedos</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </section>

          {/* Technical Info */}
          <section className="bg-surface-container rounded-3xl p-8 md:p-10 space-y-10 border border-white/5 shadow-xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-[20px]">badge</span>
                </div>
                <h3 className="font-sora text-2xl font-extrabold uppercase italic text-white tracking-tighter">Ficha de Alumno</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="label-luxury !text-[9px] !text-zinc-500">Nivel de Experiencia</label>
                   <input
                      type="text"
                      className="h-12 text-sm bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all px-4"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                      placeholder="Ej. 2 años de formación..."
                   />
                </div>
                <div className="space-y-3">
                   <label className="label-luxury !text-[9px] !text-zinc-500">Estilos de Interés</label>
                   <input
                      type="text"
                      className="h-12 text-sm bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all px-4"
                      value={formData.preferredStyles}
                      onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                      placeholder="Bachata, Urban, Jazz..."
                   />
                </div>
                <div className="md:col-span-2 space-y-3">
                   <label className="label-luxury !text-[9px] !text-zinc-500">Dedicación Estimada</label>
                   <input
                      type="text"
                      className="h-12 text-sm bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all px-4"
                      value={formData.weeklyDedication}
                      onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                      placeholder="¿Cuántas sesiones por semana?"
                   />
                </div>
                <div className="md:col-span-2 space-y-3">
                   <label className="label-luxury !text-[9px] !text-red-400/60 uppercase">Condiciones Médicas o Limitaciones</label>
                   <textarea
                      value={formData.physicalLimitations}
                      onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                      placeholder="Indica si tienes alguna lesión para adaptar los ejercicios..."
                      className="min-h-[100px] text-sm bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all p-4 resize-none"
                   />
                </div>
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Recording */}
          <section className="bg-surface-container rounded-3xl p-8 space-y-8 border border-white/5 shadow-xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-[20px]">videocam</span>
                </div>
                <h3 className="font-sora text-lg font-extrabold uppercase italic text-white tracking-tighter leading-none">Grabación</h3>
             </div>
             <div className="space-y-3">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 border ${
                      formData.recordingPreference === opt.id
                      ? 'bg-primary border-primary text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-black/40 border-white/5 text-zinc-500 hover:border-primary/50 hover:text-zinc-200'
                    }`}
                  >
                    <span className="label-luxury !text-[9px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
                  </button>
                ))}
             </div>
          </section>

          {/* Testimonial */}
          <section className="bg-surface-container rounded-3xl p-8 space-y-8 border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="absolute -bottom-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity rotate-12">
                <span className="material-symbols-outlined !text-[120px]">format_quote</span>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-[20px]">star</span>
                </div>
                <h3 className="font-sora text-lg font-extrabold uppercase italic text-white tracking-tighter leading-none">Testimonio</h3>
             </div>
             <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                    <label className="label-luxury !text-[9px] !text-zinc-500">Tu experiencia en la Academia</label>
                    <textarea
                       value={formData.testimonial}
                       onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                       placeholder="Cuéntanos cómo ha sido tu evolución..."
                       className="min-h-[160px] text-sm bg-black/40 border-white/10 rounded-xl focus:border-primary transition-all p-4 resize-none"
                    />
                </div>
                <div className="space-y-5">
                   <span className="label-luxury !text-[9px] !text-zinc-500 text-center block uppercase tracking-widest">Calificación General</span>
                   <div className="flex gap-3 justify-center bg-black/40 py-6 rounded-2xl border border-white/5 shadow-inner">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all duration-300 hover:scale-125 ${formData.testimonialStars >= star ? 'text-primary' : 'text-zinc-800'}`}
                           >
                               <span className="material-symbols-outlined !text-[28px]" style={{ fontVariationSettings: `'FILL' ${formData.testimonialStars >= star ? 1 : 0}` }}>star</span>
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
