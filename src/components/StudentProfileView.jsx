import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';
import { User, Shield, Star, CheckCircle2, ChevronRight, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const StudentProfileView = () => {
  const { user, questionnaire, updateQuestionnaire } = useStore();
  const [formData, setFormData] = useState({
    whyStarted: '',
    objectives: '',
    hardestPart: '',
    fears: '',
    recordingPreference: '',
    personalFeeling: '',
    testimonial: '',
    testimonialStars: 5,
    weeklyDedication: '1-3 horas',
    physicalLimitations: ''
  });

  useEffect(() => {
    if (questionnaire) {
      setFormData({
        whyStarted: questionnaire.whyStarted || '',
        objectives: questionnaire.objectives || '',
        hardestPart: questionnaire.hardestPart || '',
        fears: questionnaire.fears || '',
        recordingPreference: questionnaire.recordingPreference || '',
        personalFeeling: questionnaire.personalFeeling || '',
        testimonial: questionnaire.testimonial || '',
        testimonialStars: questionnaire.testimonialStars || 5,
        weeklyDedication: questionnaire.weeklyDedication || '1-3 horas',
        physicalLimitations: questionnaire.physicalLimitations || ''
      });
    }
  }, [questionnaire]);

  const handleSave = async () => {
    await updateQuestionnaire(formData);
    Swal.fire({
      icon: 'success',
      title: 'Perfil Actualizado',
      text: 'Tus preferencias han sido guardadas correctamente.',
      background: '#051424',
      color: '#fff',
      confirmButtonColor: '#D4AF37'
    });
  };

  const calculateProgress = () => {
    const fields = ['whyStarted', 'objectives', 'hardestPart', 'fears', 'recordingPreference'];
    const completed = fields.filter(f => formData[f]).length;
    return (completed / fields.length) * 100;
  };

  return (
    <div className="max-container flex flex-col lg:flex-row gap-12">
      {/* Sidebar Info */}
      <aside className="lg:w-1/3 space-y-8">
        <div className="glass-card p-10 rounded-2xl border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6">
                <User size={48} className="text-primary" />
             </div>
             <h2 className="font-sora text-3xl font-black italic text-on-surface uppercase tracking-tighter mb-2">{user?.username}</h2>
             <div className="flex gap-2 mb-6">
                <span className="bg-primary/20 text-primary font-sora text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest border border-primary/30">
                  Nivel {user?.level}
                </span>
                {user?.isPro && (
                  <span className="bg-secondary/20 text-secondary font-sora text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest border border-secondary/30">
                    Pro Member
                  </span>
                )}
             </div>

             <div className="w-full space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-sm font-sora font-bold uppercase tracking-widest text-on-surface-variant">
                   <span>Progreso DNA</span>
                   <span className="text-primary">{Math.round(calculateProgress())}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${calculateProgress()}%` }}
                   ></div>
                </div>
             </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border-none space-y-6">
           <h3 className="font-sora text-sm font-black text-primary uppercase tracking-widest italic flex items-center gap-3">
             <Shield size={18} />
             Logros Obtenidos
           </h3>
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-primary" />
                 </div>
                 <div>
                    <p className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest">Iniciado</p>
                    <p className="font-inter text-[10px] text-on-surface-variant">Bienvenido a la academia</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl opacity-40 grayscale">
                 <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Star size={20} className="text-zinc-500" />
                 </div>
                 <div>
                    <p className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest">Primera Mentoria</p>
                    <p className="font-inter text-[10px] text-on-surface-variant">Completa tu primer bloque</p>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Form */}
      <main className="lg:w-2/3 space-y-8 pb-20">
        <header className="mb-12">
           <span className="font-sora text-[10px] text-primary mb-4 block uppercase tracking-[0.4em] font-bold">DNA DEL BAILARÍN</span>
           <h1 className="font-sora text-4xl md:text-5xl italic font-black text-on-surface leading-tight uppercase tracking-tighter">
             Cuestionario de <span className="text-primary">Evolución</span>
           </h1>
           <p className="font-inter text-lg text-on-surface-variant mt-4">
             Tu instructor utiliza esta información para personalizar cada bloque de entrenamiento.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Question: Why started */}
          <div className="space-y-4">
            <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">¿Por qué empezaste a bailar?</label>
            <div className="grid grid-cols-1 gap-2">
              {QUESTIONNAIRE_OPTIONS.whyStarted.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({...formData, whyStarted: opt.id})}
                  className={`text-left px-6 py-4 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    formData.whyStarted === opt.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question: Objectives */}
          <div className="space-y-4">
            <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">Tu objetivo principal</label>
            <div className="grid grid-cols-1 gap-2">
              {QUESTIONNAIRE_OPTIONS.objectives.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({...formData, objectives: opt.id})}
                  className={`text-left px-6 py-4 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    formData.objectives === opt.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question: Hardest part */}
          <div className="space-y-4">
            <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">Lo que más te cuesta</label>
            <div className="grid grid-cols-1 gap-2">
              {QUESTIONNAIRE_OPTIONS.hardestPart.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({...formData, hardestPart: opt.id})}
                  className={`text-left px-6 py-4 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    formData.hardestPart === opt.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

           {/* Question: Recording preference */}
           <div className="space-y-4">
            <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">Preferencia de grabación</label>
            <div className="grid grid-cols-1 gap-2">
              {QUESTIONNAIRE_OPTIONS.recordingPreference.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormData({...formData, recordingPreference: opt.id})}
                  className={`text-left px-6 py-4 rounded-xl font-sora text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    formData.recordingPreference === opt.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-12">
           <div className="space-y-4">
              <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">Limitaciones físicas (si las hay)</label>
              <textarea
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter min-h-[120px]"
                placeholder="Indica cualquier lesión o dificultad física para que el instructor la tenga en cuenta..."
                value={formData.physicalLimitations}
                onChange={(e) => setFormData({...formData, physicalLimitations: e.target.value})}
              />
           </div>

           <div className="space-y-4">
              <label className="font-sora text-xs font-bold text-on-surface uppercase tracking-widest ml-1">¿Cómo te sientes actualmente con tu baile?</label>
              <textarea
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter min-h-[120px]"
                placeholder="Describe tu situación actual y tus sensaciones..."
                value={formData.personalFeeling}
                onChange={(e) => setFormData({...formData, personalFeeling: e.target.value})}
              />
           </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-black font-sora font-black py-6 rounded-2xl uppercase tracking-[0.3em] italic hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl active-glow flex items-center justify-center gap-4"
        >
          <Save size={24} />
          Guardar mi ADN de Bailarín
        </button>
      </main>
    </div>
  );
};

export default StudentProfileView;
