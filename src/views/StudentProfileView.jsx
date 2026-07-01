import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Target, Zap, Video, Award, Check, Activity, Star } from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import {
  DFCard,
  DFButton,
  DFInput,
  DFTextarea,
  DFPageHeader,
  DFPageActions,
  DFContainer
} from '../components/ui';

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
      background: '#0A1828',
      color: '#D4AF37',
      customClass: { popup: 'df-card !border-df-primary/40' }
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
            className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 border-2 text-left cursor-pointer ${
              selected.includes(opt.id)
              ? 'border-df-primary/40 bg-df-primary/10 text-df-primary shadow-lg'
              : 'border-df-border bg-df-surface-3 text-df-text-muted hover:border-df-primary/20 hover:text-df-text-soft'
            }`}
          >
            <span className="df-label !text-[10px]">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={14} strokeWidth={4} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <DFPageHeader
        title="Mi Perfil Flow"
        subtitle="Tu identidad artística y objetivos personales en la academia."
      >
        <DFPageActions>
          <div className="hidden sm:flex flex-col items-end mr-4">
              <div className="flex justify-between w-40 mb-1.5">
                 <span className="df-label !text-[8px] text-df-text-muted">Progreso</span>
                 <span className="df-label !text-[8px] text-df-primary font-bold">{completion}%</span>
              </div>
              <div className="h-1 w-40 bg-df-surface-3 rounded-full overflow-hidden border border-df-border-subtle">
                 <div className="h-full bg-df-primary transition-all duration-1000 ease-out" style={{ width: `${completion}%` }} />
              </div>
          </div>
          <DFButton onClick={handleSubmit} variant="primary" size="md" className="min-w-[120px]">
             Guardar Cambios
          </DFButton>
        </DFPageActions>
      </DFPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1 */}
          <DFCard className="bg-df-surface-2 border-df-border-subtle p-8 md:p-10">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-df-primary/5 rounded-xl text-df-primary border border-df-primary/10">
                    <Target size={22} />
                </div>
                <h3 className="df-title uppercase italic">Objetivos de Maestría</h3>
             </div>
             <div className="space-y-10">
                <div className="space-y-5">
                   <label className="df-label text-df-text-muted">¿Por qué decidiste empezar?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-5">
                   <label className="df-label text-df-text-muted">Tus metas actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </DFCard>

          {/* Section 2 */}
          <DFCard className="bg-df-surface-2 border-df-border-subtle p-8 md:p-10">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-df-primary/5 rounded-xl text-df-primary border border-df-primary/10">
                    <Zap size={22} />
                </div>
                <h3 className="df-title uppercase italic">Desafíos Artísticos</h3>
             </div>
             <div className="space-y-10">
                <div className="space-y-5">
                   <label className="df-label text-df-text-muted">¿Qué aspecto te resulta más complejo?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-5">
                   <label className="df-label text-df-text-muted">Posibles barreras o miedos</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </DFCard>

          {/* Section 3 */}
          <DFCard className="bg-df-surface-2 border-df-border-subtle p-8 md:p-10">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-df-primary/5 rounded-xl text-df-primary border border-df-primary/10">
                    <Activity size={22} />
                </div>
                <h3 className="df-title uppercase italic">Perfil Técnico</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DFInput
                   label="Nivel de Experiencia"
                   value={formData.experienceLevel}
                   onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                   placeholder="Ej. 6 meses, 2 años..."
                />
                <DFInput
                   label="Estilos Preferidos"
                   value={formData.preferredStyles}
                   onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                   placeholder="Bachata, Salsa..."
                />
                <DFInput
                   label="Dedicación Semanal"
                   containerClassName="md:col-span-2"
                   value={formData.weeklyDedication}
                   onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                   placeholder="¿Cuántas horas o días a la semana?"
                />
                <DFTextarea
                   label="Observaciones Físicas o Limitaciones"
                   containerClassName="md:col-span-2"
                   value={formData.physicalLimitations}
                   onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                   placeholder="Detalla cualquier limitación para adaptar tu entrenamiento..."
                   rows={3}
                />
             </div>
          </DFCard>
        </div>

        <div className="space-y-8">
          {/* Recording Pref */}
          <DFCard className="bg-df-surface-2 border-df-border-subtle p-6 md:p-8">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-df-primary/5 rounded-xl text-df-primary border border-df-primary/10">
                    <Video size={20} />
                </div>
                <h3 className="df-title uppercase italic">Grabación</h3>
             </div>
             <div className="space-y-2.5">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 border-2 cursor-pointer ${
                      formData.recordingPreference === opt.id
                      ? 'border-df-primary/40 bg-df-primary/10 text-df-primary shadow-md'
                      : 'border-df-border bg-df-surface-3 text-df-text-muted hover:border-df-primary/20 hover:text-df-text-soft'
                    }`}
                  >
                    <span className="df-label !text-[9px] font-bold">{opt.label}</span>
                  </button>
                ))}
             </div>
          </DFCard>

          {/* Testimonial */}
          <DFCard className="bg-df-surface-2 border-df-border-subtle p-6 md:p-8">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-df-primary/5 rounded-xl text-df-primary border border-df-primary/10">
                    <Award size={20} />
                </div>
                <h3 className="df-title uppercase italic">Tu Historia</h3>
             </div>
             <div className="space-y-8">
                <DFTextarea
                   label="Tu Testimonio Público"
                   value={formData.testimonial}
                   onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                   placeholder="Comparte tu evolución con la comunidad..."
                   rows={5}
                />
                <div className="space-y-5">
                   <span className="df-label text-df-text-muted text-center block">Calificación de Experiencia</span>
                   <div className="flex gap-4 justify-center bg-df-bg/40 py-5 rounded-2xl border border-df-border-subtle shadow-inner">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all duration-300 hover:scale-125 cursor-pointer ${formData.testimonialStars >= star ? 'text-df-primary' : 'text-df-surface-3'}`}
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
    </div>
  );
};

export default StudentProfileView;
