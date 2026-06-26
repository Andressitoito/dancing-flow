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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="label-luxury !text-[9px]">Gestión Personal</span>
          <div className="flex items-center gap-4 mt-1">
            <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white italic uppercase tracking-tighter leading-none">Mi <span className="text-primary">Perfil</span></h1>
            {user?.isPro && (
                <span className="bg-primary/10 text-primary text-[8px] font-bold px-3 py-1 rounded border border-primary/20 uppercase tracking-widest">PRO</span>
            )}
          </div>
          <p className="font-sora text-zinc-500 text-sm font-light mt-2">Personaliza tu experiencia y objetivos de maestría.</p>
        </div>

        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-lg border border-white/5">
           <div className="hidden sm:block w-40 space-y-2">
              <div className="flex justify-between label-luxury !text-[8px] !text-zinc-500">
                 <span>Completado</span>
                 <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <button onClick={handleSubmit} className="btn-primary !h-10 !px-8 !text-[9px]">
             Guardar
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Objectives */}
          <section className="glass-card p-6 md:p-8 space-y-8 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary !text-[20px]">target</span>
                <h3 className="font-sora text-lg font-bold uppercase italic text-white">Objetivos</h3>
             </div>
             <div className="space-y-8">
                <div className="space-y-4">
                   <label className="label-luxury !text-[8px] !text-zinc-500">¿Por qué empezaste?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-4">
                   <label className="label-luxury !text-[8px] !text-zinc-500">Metas actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </section>

          {/* Challenges */}
          <section className="glass-card p-6 md:p-8 space-y-8 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary !text-[20px]">bolt</span>
                <h3 className="font-sora text-lg font-bold uppercase italic text-white">Desafíos</h3>
             </div>
             <div className="space-y-8">
                <div className="space-y-4">
                   <label className="label-luxury !text-[8px] !text-zinc-500">¿Qué es lo que más te cuesta?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-4">
                   <label className="label-luxury !text-[8px] !text-zinc-500">Miedos o barreras</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </section>

          {/* Technical Info */}
          <section className="glass-card p-6 md:p-8 space-y-8 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary !text-[20px]">monitoring</span>
                <h3 className="font-sora text-lg font-bold uppercase italic text-white">Ficha Técnica</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="label-luxury !text-[8px] !text-zinc-500">Nivel de Experiencia</label>
                   <input
                      type="text"
                      className="h-10 text-xs"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                      placeholder="Ej. 6 meses, 2 años..."
                   />
                </div>
                <div className="space-y-2">
                   <label className="label-luxury !text-[8px] !text-zinc-500">Estilos Preferidos</label>
                   <input
                      type="text"
                      className="h-10 text-xs"
                      value={formData.preferredStyles}
                      onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                      placeholder="Bachata, Salsa..."
                   />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="label-luxury !text-[8px] !text-zinc-500">Dedicación Semanal</label>
                   <input
                      type="text"
                      className="h-10 text-xs"
                      value={formData.weeklyDedication}
                      onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                      placeholder="¿Cuántas horas o días a la semana?"
                   />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="label-luxury !text-[8px] !text-red-400/50 uppercase">Lesiones o Limitaciones</label>
                   <textarea
                      value={formData.physicalLimitations}
                      onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                      placeholder="Detalla cualquier limitación para adaptar tu entrenamiento..."
                      className="min-h-[80px] text-xs"
                   />
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Recording */}
          <section className="glass-card p-6 space-y-6 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary !text-[20px]">videocam</span>
                <h3 className="font-sora text-base font-bold uppercase italic text-white">Grabación</h3>
             </div>
             <div className="space-y-2">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 border text-xs ${
                      formData.recordingPreference === opt.id
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-black/40 border-white/5 text-zinc-500 hover:text-white'
                    }`}
                  >
                    <span className="label-luxury !text-[8px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
                  </button>
                ))}
             </div>
          </section>

          {/* Testimonial */}
          <section className="glass-card p-6 space-y-6 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary !text-[20px]">stars</span>
                <h3 className="font-sora text-base font-bold uppercase italic text-white">Testimonio</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                    <label className="label-luxury !text-[8px] !text-zinc-500">Mensaje Público</label>
                    <textarea
                       value={formData.testimonial}
                       onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                       placeholder="Comparte tu evolución..."
                       className="min-h-[120px] text-xs"
                    />
                </div>
                <div className="space-y-4">
                   <span className="label-luxury !text-[8px] !text-zinc-500 text-center block">Calificación</span>
                   <div className="flex gap-2 justify-center bg-black/40 py-4 rounded-lg border border-white/5">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all duration-200 hover:scale-110 ${formData.testimonialStars >= star ? 'text-primary' : 'text-zinc-800'}`}
                           >
                               <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${formData.testimonialStars >= star ? 1 : 0}` }}>star</span>
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
