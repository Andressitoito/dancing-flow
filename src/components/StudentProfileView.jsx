import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Save, CheckCircle2, User, Target, Zap, AlertTriangle, Video, Award, Check, BarChart } from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';
import Swal from 'sweetalert2';

const StudentProfileView = () => {
  const { user, questionnaire, updateQuestionnaire } = useStore();
  const [formData, setFormData] = useState({
    whyStarted: '',
    objectives: '',
    hardestPart: '',
    fears: '',
    recordingPreference: 'alone',
    personalFeeling: ''
  });

  useEffect(() => {
    if (questionnaire) {
      setFormData({
        whyStarted: questionnaire.whyStarted || '',
        objectives: questionnaire.objectives || '',
        hardestPart: questionnaire.hardestPart || '',
        fears: questionnaire.fears || '',
        recordingPreference: questionnaire.recordingPreference || 'alone',
        personalFeeling: questionnaire.personalFeeling || ''
      });
    }
  }, [questionnaire]);

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
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
              selected.includes(opt.id)
              ? 'bg-primary/20 border-primary text-primary'
              : 'bg-background/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="text-sm font-medium">{opt.label}</span>
            {selected.includes(opt.id) && <Check size={16} />}
          </button>
        ))}
      </div>
    );
  };

  const completion = questionnaire?.completionPercentage || 0;

  return (
    <div className="py-10 pb-32 md:pb-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Mi Perfil</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {/* Why Started */}
        <section className="space-y-4 bg-surface-glass backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-4">
            <User size={24} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">¿Por qué empecé a bailar?</h2>
          </div>
          {renderMultiSelect('whyStarted', QUESTIONNAIRE_OPTIONS.whyStarted)}
        </section>

        {/* Objectives */}
        <section className="space-y-4 bg-surface-glass backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Target size={24} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">¿Cuáles son mis objetivos?</h2>
          </div>
          {renderMultiSelect('objectives', QUESTIONNAIRE_OPTIONS.objectives)}
        </section>

        {/* Hardest Part */}
        <section className="space-y-4 bg-surface-glass backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Zap size={24} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">¿Qué me cuesta más?</h2>
          </div>
          {renderMultiSelect('hardestPart', QUESTIONNAIRE_OPTIONS.hardestPart)}
        </section>

        {/* Fears */}
        <section className="space-y-4 bg-surface-glass backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">¿Qué miedos tengo?</h2>
          </div>
          {renderMultiSelect('fears', QUESTIONNAIRE_OPTIONS.fears)}
        </section>
      </div>

      {/* Recording Preferences */}
      <section className="px-4 md:px-0">
        <div className="bg-surface-glass backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 text-primary mb-8">
            <Video size={28} />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] italic">Preferencias de Entrenamiento</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUESTIONNAIRE_OPTIONS.recordingPreference.map((opt) => {
              const isActive = formData.recordingPreference === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSingleOption('recordingPreference', opt.id)}
                  className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isActive
                    ? 'bg-primary border-primary text-background shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-[1.02]'
                    : 'bg-background/40 border-white/5 text-zinc-400 hover:border-primary/30 hover:bg-background/60'
                  }`}
                >
                  <span className="font-bold text-sm uppercase tracking-tight">{opt.label}</span>
                  {isActive && <CheckCircle2 size={20} className="ml-auto" />}
                </button>
              );
            })}
          </div>

          <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-3 text-primary mb-4">
                <Target size={24} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">¿Cómo me siento hoy con el baile?</h2>
             </div>
             <textarea
                value={formData.personalFeeling}
                onChange={(e) => setFormData({...formData, personalFeeling: e.target.value})}
                placeholder="Comparte tus sensaciones personales..."
                className="w-full bg-background/50 border border-white/10 rounded-2xl p-6 text-base focus:border-primary outline-none min-h-[120px] transition-colors"
             />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfileView;
