import React from 'react';
import { Users, Star, UserCheck, Activity } from 'lucide-react';
import { DFCard } from './ui/index';

const StatsSection = ({ users }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const total = safeUsers.length;
  const proCount = safeUsers.filter(u => u.isPro).length;
  const femalesCount = safeUsers.filter(u => u.gender === "female").length;
  const activeCount = safeUsers.filter(u => u.status === "active").length;

  const stats = [
    { label: 'Comunidad Total', value: total, icon: Users, color: 'text-df-text' },
    { label: 'Alumnos PRO', value: proCount, icon: Star, color: 'text-df-primary' },
    { label: 'Comunidad Femenina', value: femalesCount, icon: Activity, color: 'text-df-text-soft' },
    { label: 'Usuarios Activos', value: activeCount, icon: UserCheck, color: 'text-df-success' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <DFCard key={i} className="flex flex-col items-center justify-center text-center p-8 group hover:border-df-primary/30 transition-all duration-500">
           <div className={`p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 group-hover:bg-df-primary/10 transition-all duration-500 ${stat.color}`}>
              <stat.icon size={28} />
           </div>
           <p className="df-label !text-[10px] !text-df-text-muted mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
           <h3 className="df-display-lg !text-4xl tracking-tighter">{stat.value}</h3>
        </DFCard>
      ))}
    </div>
  );
};

export default StatsSection;
