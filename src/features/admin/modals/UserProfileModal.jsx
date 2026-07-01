import React from 'react';
import {
  DFModal,
  DFBadge,
  DFAvatar,
  DFCard
} from '../../../components/ui';
import {
  Mail,
  Star,
  Activity,
  Target,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { QUESTIONNAIRE_OPTIONS } from '../../../services/constants';

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const q = user.Questionnaire || {};

  const getLabel = (type, id) => {
    const options = QUESTIONNAIRE_OPTIONS[type];
    return options?.find(o => o.id === id)?.label || id || 'No especificado';
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="mt-0.5 text-primary/60">
        <Icon size={16} />
      </div>
      <div>
        <p className="df-label !text-[9px] !text-zinc-500 !tracking-widest mb-0.5 uppercase">{label}</p>
        <p className="text-sm text-white font-medium">{value || 'No especificado'}</p>
      </div>
    </div>
  );

  return (
    <DFModal
      isOpen={!!user}
      onClose={onClose}
      title="Perfil del Alumno"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Header Info */}
        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <DFAvatar name={user.username} size={64} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-sora text-xl font-bold text-white italic uppercase tracking-tight">
                {user.username}
              </h2>
              <DFBadge variant={user.isPro ? "primary" : "secondary"} size="xs">
                {user.isPro ? "PRO" : "Standard"}
              </DFBadge>
            </div>
            <p className="text-zinc-500 text-sm flex items-center gap-1.5">
              <Mail size={14} /> {user.email || 'Sin correo electrónico'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Goals */}
          <section>
            <h3 className="df-label !text-[10px] text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Target size={14} /> Objetivos y Motivación
            </h3>
            <DFCard padding="sm" className="bg-black/20">
              <InfoRow icon={Star} label="Motivación Principal" value={getLabel('motivations', q.motivation)} />
              <InfoRow icon={ShieldAlert} label="Miedos/Obstáculos" value={getLabel('fears', q.fear)} />
              <InfoRow icon={Target} label="Meta a 6 Meses" value={getLabel('goals', q.goal)} />
            </DFCard>
          </section>

          {/* Technical Info */}
          <section>
            <h3 className="df-label !text-[10px] text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Activity size={14} /> Perfil Técnico
            </h3>
            <DFCard padding="sm" className="bg-black/20">
              <InfoRow icon={Activity} label="Nivel de Experiencia" value={q.experienceLevel} />
              <InfoRow icon={Clock} label="Dedicación Semanal" value={q.weeklyDedication} />
              <InfoRow icon={Activity} label="Estilos Preferidos" value={q.preferredStyles} />
            </DFCard>
          </section>
        </div>

        {/* Physical Limitations */}
        {q.physicalLimitations && (
          <section>
            <h3 className="df-label !text-[10px] text-red-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <ShieldAlert size={14} /> Limitaciones Físicas
            </h3>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-200/70 leading-relaxed italic">
                "{q.physicalLimitations}"
              </p>
            </div>
          </section>
        )}

        {/* Progress */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="df-label !text-[10px] text-primary flex items-center gap-2 uppercase tracking-widest">
              <Activity size={14} /> Progreso del Cuestionario
            </h3>
            <span className="text-primary font-bold text-sm">{q.completionPercentage || 0}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
              style={{ width: `${q.completionPercentage || 0}%` }}
            />
          </div>
        </section>
      </div>
    </DFModal>
  );
};

export default UserProfileModal;
