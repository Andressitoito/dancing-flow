import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { Target, Zap, Video, Award, Check, Activity, Star } from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../../services/constants';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import {
  DFCard,
  DFButton,
  DFInput,
  DFTextarea,
  DFPageHeader,
  DFContainer,
  DFBadge
} from '../../components/ui/index';

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
            <span className="df-label !text-[10px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={16} strokeWidth={3} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <DFContainer className="pb-24">
      <DFPageHeader
        title={
          <div className="flex items-center gap-6">
            Mi <span className="text-primary">Perfil</span>
            {user?.isPro && (
              <DFBadge variant="primary" className="!px-4 !py-1.5 uppercase tracking-widest neon-gold">PRO</DFBadge>
            )}
          </div>
        }
        subtitle="Personaliza tu experiencia y objetivos de maestría."
      >
        <div className="flex items-center gap-8 bg-white/5 p-6 rounded-2xl border border-white/5">
           <div className="hidden sm:block w-48 space-y-3">
              <div className="flex justify-between df-label !text-[9px] !text-zinc-500">
                 <span>Progreso de Perfil</span>
                 <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <DFButton size="lg" onClick={handleSubmit}>
             Guardar
           </DFButton>
        </div>
      </DFPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1 */}
          <DFCard padding="lg" className="space-y-10" hover={false}>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Target size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Objetivos de Baile</h3>
             </div>
             <div className="space-y-12">
                <div className="space-y-6">
                   <label className="df-label !text-zinc-500">¿Por qué empezaste?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-6">
                   <label className="df-label !text-zinc-500">Objetivos actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </DFCard>

          {/* Section 2 */}
          <DFCard padding="lg" className="space-y-10" hover={false}>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Zap size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Desafíos y Miedos</h3>
             </div>
             <div className="space-y-12">
                <div className="space-y-6">
                   <label className="df-label !text-zinc-500">¿Qué es lo que más te cuesta?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-6">
                   <label className="df-label !text-zinc-500">Miedos o barreras</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </DFCard>

          {/* Section 3 */}
          <DFCard padding="lg" className="space-y-10" hover={false}>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Activity size={24} />
                </div>
                <h3 className="font-sora text-2xl font-bold uppercase italic text-white">Detalles Técnicos</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <DFInput
                  label="Nivel de Experiencia"
                  placeholder="Ej. 6 meses, 2 años..."
                  value={formData.experienceLevel}
                  onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                />
                <DFInput
                  label="Estilos Preferidos"
                  placeholder="Bachata, Salsa..."
                  value={formData.preferredStyles}
                  onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                />
                <div className="md:col-span-2">
                  <DFInput
                    label="Dedicación Semanal"
                    placeholder="¿Cuántas horas o días a la semana?"
                    value={formData.weeklyDedication}
                    onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <DFTextarea
                    label="Lesiones o Limitaciones"
                    labelClassName="!text-red-500/60"
                    placeholder="Detalla cualquier limitación para adaptar tu entrenamiento..."
                    value={formData.physicalLimitations}
                    onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                  />
                </div>
             </div>
          </DFCard>
        </div>

        <div className="space-y-8">
          {/* Recording Pref */}
          <DFCard padding="lg" className="space-y-10" hover={false}>
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
                    <span className="df-label !text-[9px] !tracking-[0.1em] !color-inherit">{opt.label}</span>
                  </button>
                ))}
             </div>
          </DFCard>

          {/* Testimonial */}
          <DFCard padding="lg" className="space-y-10" hover={false}>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded text-primary">
                    <Award size={24} />
                </div>
                <h3 className="font-sora text-xl font-bold uppercase italic text-white">Testimonio</h3>
             </div>
             <div className="space-y-8">
                <DFTextarea
                  label="Tu Mensaje Público"
                  className="!min-h-[160px]"
                  placeholder="Comparte tu evolución con la comunidad..."
                  value={formData.testimonial}
                  onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                />
                <div className="space-y-6">
                   <span className="df-label !text-zinc-500 text-center block">Calificación</span>
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
          </DFCard>
        </div>
      </div>
    </DFContainer>
  );
};

export default StudentProfileView;
