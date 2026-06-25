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
      title: 'Perfil Actualizado',
      text: 'Tus objetivos se han guardado correctamente.',
      timer: 1500,
      showConfirmButton: false,
      background: '#18181b',
      color: '#fff',
      customClass: { popup: 'rounded-2xl border border-white/5 shadow-2xl' }
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
            className={`flex items-center justify-between px-4 py-2 rounded-lg border text-left transition-all ${
              selected.includes(opt.id)
              ? 'bg-primary/10 border-primary/50 text-primary shadow-[0_0_10px_rgba(244,114,182,0.1)]'
              : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/10'
            }`}
          >
            <span className="text-sm font-medium">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={14} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* SaaS Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">Mi Perfil</h1>
            {user?.isPro && (
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded border border-primary/20 uppercase tracking-widest">PRO</span>
            )}
          </div>
          <p className="text-zinc-500 text-sm mt-1">Completa tu información para un seguimiento preciso.</p>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden sm:block w-48 space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                 <span>Completado</span>
                 <span className={completion === 100 ? 'text-primary' : ''}>{completion}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
           </div>
           <button onClick={handleSubmit} className="btn-primary">
             Guardar Perfil
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sections */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card space-y-4">
             <div className="flex items-center gap-2 text-zinc-300">
                <Target size={18} />
                <h3 className="text-lg font-bold">Objetivos de Baile</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label>¿Por qué empezaste?</label>
                   {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
                </div>
                <div className="space-y-3">
                   <label>Objetivos actuales</label>
                   {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
                </div>
             </div>
          </section>

          <section className="card space-y-4">
             <div className="flex items-center gap-2 text-zinc-300">
                <Zap size={18} />
                <h3 className="text-lg font-bold">Desafíos y Miedos</h3>
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label>¿Qué es lo que más te cuesta?</label>
                   {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
                </div>
                <div className="space-y-3">
                   <label>Miedos o barreras</label>
                   {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
                </div>
             </div>
          </section>

          <section className="card space-y-4">
             <div className="flex items-center gap-2 text-zinc-300">
                <Activity size={18} />
                <h3 className="text-lg font-bold">Detalles de Entrenamiento</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label>Nivel de Experiencia</label>
                   <input
                      type="text"
                      value={formData.experienceLevel}
                      onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                      placeholder="Ej. 6 meses, 2 años..."
                      className="w-full"
                   />
                </div>
                <div className="space-y-1.5">
                   <label>Estilos Preferidos</label>
                   <input
                      type="text"
                      value={formData.preferredStyles}
                      onChange={e => setFormData({...formData, preferredStyles: e.target.value})}
                      placeholder="Bachata, Salsa..."
                      className="w-full"
                   />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <label>Dedicación Semanal</label>
                   <input
                      type="text"
                      value={formData.weeklyDedication}
                      onChange={e => setFormData({...formData, weeklyDedication: e.target.value})}
                      placeholder="¿Cuántas horas o días?"
                      className="w-full"
                   />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <label className="!text-red-400/70">Lesiones o Limitaciones</label>
                   <textarea
                      value={formData.physicalLimitations}
                      onChange={e => setFormData({...formData, physicalLimitations: e.target.value})}
                      placeholder="Ej. Rodilla derecha, espalda baja..."
                      className="w-full min-h-[60px]"
                   />
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-6">
          <section className="card space-y-4">
             <div className="flex items-center gap-2 text-zinc-300">
                <Video size={18} />
                <h3 className="text-lg font-bold">Grabación</h3>
             </div>
             <div className="space-y-2">
                {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSingleOption('recordingPreference', opt.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.recordingPreference === opt.id
                      ? 'bg-primary/10 border-primary text-primary shadow-lg'
                      : 'bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-tight">{opt.label}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="card space-y-4">
             <div className="flex items-center gap-2 text-zinc-300">
                <Award size={18} />
                <h3 className="text-lg font-bold">Feedback Web</h3>
             </div>
             <div className="space-y-3">
                <label>Tu Testimonio</label>
                <textarea
                   value={formData.testimonial}
                   onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                   placeholder="Escribe tu experiencia..."
                   className="w-full min-h-[100px]"
                />
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase text-zinc-500">Puntuación</span>
                   <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                           <button
                               key={star}
                               onClick={() => setFormData({...formData, testimonialStars: star})}
                               className={`transition-all ${formData.testimonialStars >= star ? 'text-secondary' : 'text-zinc-800'}`}
                           >
                               <Award size={20} fill={formData.testimonialStars >= star ? 'currentColor' : 'none'} />
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
