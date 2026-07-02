import React from 'react';
import {
  X,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Star,
  User,
  Heart,
  TrendingUp,
  Clock,
  Target,
  Dumbbell
} from 'lucide-react';
import {
  DFModal,
  DFBadge,
  DFAvatar,
  DFCard,
  DFButton,
  DFContainer
} from './ui/index';
import { QUESTIONNAIRE_OPTIONS } from '../services/constants';

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  const q = user.Questionnaire || {};

  const getOptionLabel = (field, id) => {
    const option = QUESTIONNAIRE_OPTIONS[field]?.find(opt => opt.id === id);
    return option ? option.label : id;
  };

  const infoItems = [
    { label: 'Nivel', value: user.level, icon: Target },
    { label: 'Género', value: user.gender, icon: User },
    { label: 'Dedicación', value: getOptionLabel('weeklyDedication', q.weeklyDedication), icon: Clock },
    { label: 'Preferencias', value: getOptionLabel('recordingPreference', q.recordingPreference), icon: Activity },
  ];

  return (
    <DFModal isOpen={true} onClose={onClose} title={`Perfil de ${user.username}`} size="xl">
        <div className="space-y-8 pb-4 max-h-[80vh] overflow-y-auto custom-scrollbar px-1">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <DFAvatar name={user.username} size="xl" className="shadow-2xl border-4 border-df-primary/20" />
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="df-heading-xl uppercase italic tracking-tighter">{user.username}</h2>
                        <DFBadge variant={user.isPro ? "primary" : "secondary"}>
                            {user.isPro ? 'Alumno PRO' : 'Standard'}
                        </DFBadge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {infoItems.map((item, i) => (
                            <div key={i} className="p-4 bg-df-surface-2 rounded-2xl border border-df-border-subtle">
                                <div className="flex items-center gap-2 mb-2 text-df-primary opacity-60">
                                    <item.icon size={14} />
                                    <span className="df-label !text-[9px]">{item.label}</span>
                                </div>
                                <p className="df-subtitle !text-xs truncate">{item.value || 'No definido'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metas y Motivación */}
                <div className="lg:col-span-2 space-y-6">
                    <DFCard header={<span className="df-label !text-[10px] text-df-primary">Metas & Motivación</span>} className="bg-df-primary/[0.02]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="df-label !text-[9px] text-df-text-muted mb-2">Motivación Principal</h4>
                                    <p className="df-body-sm italic">"{getOptionLabel('motivation', q.motivation) || 'No especificada'}"</p>
                                </div>
                                <div>
                                    <h4 className="df-label !text-[9px] text-df-text-muted mb-2">Objetivo Final</h4>
                                    <p className="df-body-sm italic">"{getOptionLabel('mainGoal', q.mainGoal) || 'No especificado'}"</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="df-label !text-[9px] text-df-text-muted mb-2">Limitaciones Físicas</h4>
                                    <p className="df-body-sm text-df-danger/80">{q.physicalLimitations || 'Ninguna'}</p>
                                </div>
                                <div>
                                    <h4 className="df-label !text-[9px] text-df-text-muted mb-2">Estilos Preferidos</h4>
                                    <p className="df-body-sm">{q.preferredStyles || 'No especificados'}</p>
                                </div>
                            </div>
                        </div>
                    </DFCard>

                    <DFCard header={<span className="df-label !text-[10px] text-df-primary">Progreso & Feeling</span>}>
                        <div className="flex items-center gap-8">
                            <div className="text-center p-6 bg-df-surface-2 rounded-3xl border border-df-border flex-1">
                                <p className="df-label !text-[9px] text-df-text-muted mb-3">Completitud del Perfil</p>
                                <div className="df-heading-xl text-df-primary">{q.completionPercentage || 0}%</div>
                            </div>
                            <div className="flex-1">
                                <h4 className="df-label !text-[9px] text-df-text-muted mb-3">Estado de Ánimo Personal</h4>
                                <div className="p-4 bg-df-surface-2 rounded-2xl border border-df-border-subtle italic text-df-text-soft">
                                    "{q.personalFeeling || 'El alumno no ha actualizado su estado.'}"
                                </div>
                            </div>
                        </div>
                    </DFCard>
                </div>

                {/* Testimonio y Otros */}
                <div className="space-y-6">
                    <DFCard header={<span className="df-label !text-[10px] text-df-primary">Review del Alumno</span>}>
                        <div className="space-y-4 text-center">
                            <div className="flex justify-center text-df-primary gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < (q.testimonialStars || 0) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <p className="df-body-sm italic opacity-80 leading-relaxed">
                                {q.testimonial ? `"${q.testimonial}"` : 'El alumno aún no ha dejado un testimonio público.'}
                            </p>
                        </div>
                    </DFCard>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-df-primary/20 to-transparent border border-df-primary/20 flex flex-col items-center gap-4">
                        <TrendingUp className="text-df-primary" size={32} />
                        <div className="text-center">
                           <p className="df-label !text-[10px] mb-1">Status Académico</p>
                           <p className="df-subtitle !text-sm uppercase font-black italic tracking-tighter">Estudiante en Evolución</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DFModal>
  );
};

export default UserProfileModal;
