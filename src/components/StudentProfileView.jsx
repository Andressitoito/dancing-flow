import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Save, CheckCircle2, MessageSquare } from 'lucide-react';
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
    testimonial: ''
  });

  useEffect(() => {
    if (questionnaire) {
      setFormData({
        whyStarted: questionnaire.whyStarted || '',
        objectives: questionnaire.objectives || '',
        hardestPart: questionnaire.hardestPart || '',
        fears: questionnaire.fears || '',
        recordingPreference: questionnaire.recordingPreference || 'alone',
        personalFeeling: questionnaire.personalFeeling || '',
        testimonial: questionnaire.testimonial || ''
      });
    }
  }, [questionnaire]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateQuestionnaire(formData);
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'Tu perfil ha sido actualizado.',
      timer: 2000,
      showConfirmButton: false,
      background: '#18181b',
      color: '#fff'
    });
  };

  const progress = questionnaire?.completionPercentage || 0;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-primary italic uppercase">Mi Perfil</h1>
        <p className="text-zinc-500 text-sm">Completa tu información para que tus profes te conozcan mejor.</p>
      </header>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
          <span>Progreso del Perfil</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 bg-surface border border-outline rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-4 bg-surface p-4 rounded-2xl border border-outline">
          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">¿Por qué empecé a bailar?</span>
            <textarea
              name="whyStarted"
              value={formData.whyStarted}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]"
              placeholder="Cuéntanos tu motivación..."
            />
          </label>

          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">¿Cuáles son mis objetivos?</span>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]"
              placeholder="Ej: Bailar en social, hacer un show, ser profesor..."
            />
          </label>

          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">¿Qué me cuesta más?</span>
            <textarea
              name="hardestPart"
              value={formData.hardestPart}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]"
              placeholder="Técnica, musicalidad, conexión..."
            />
          </label>

          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">¿Qué miedos tengo?</span>
            <textarea
              name="fears"
              value={formData.fears}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]"
              placeholder="Hacer el ridículo, la cámara, bailar en público..."
            />
          </label>
        </section>

        <section className="space-y-4 bg-surface p-4 rounded-2xl border border-outline">
          <span className="text-xs font-black text-primary uppercase ml-1">Preferencias de Grabación</span>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'alone', label: 'Prefiero grabar solo' },
              { id: 'couple', label: 'Quiero grabar en pareja' },
              { id: 'shy', label: 'Me da vergüenza la cámara' },
              { id: 'show', label: 'Quiero hacer shows' },
              { id: 'training_teacher', label: 'Entrenando para profesor' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData({ ...formData, recordingPreference: opt.id })}
                className={`text-left p-3 rounded-xl text-xs font-bold border transition-all ${
                  formData.recordingPreference === opt.id
                  ? 'bg-primary border-primary text-background'
                  : 'bg-background border-outline text-zinc-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 bg-surface p-4 rounded-2xl border border-outline">
          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">¿Cómo me siento con mi baile?</span>
            <textarea
              name="personalFeeling"
              value={formData.personalFeeling}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[100px]"
              placeholder="Describe tu estado actual personalmente..."
            />
          </label>
        </section>

        <section className="space-y-4 bg-surface p-4 rounded-2xl border border-outline">
          <label className="block">
            <span className="text-xs font-black text-primary uppercase ml-1">Testimonio para la web (Opcional)</span>
            <textarea
              name="testimonial"
              value={formData.testimonial}
              onChange={handleChange}
              className="w-full mt-1 bg-background border border-outline rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]"
              placeholder="¿Qué te parece la plataforma?"
            />
          </label>
        </section>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-background font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Save size={20} />
          GUARDAR MI PROGRESO
        </button>
      </div>
    </div>
  );
};

export default StudentProfileView;
