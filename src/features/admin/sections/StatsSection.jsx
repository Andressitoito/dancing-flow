import React from "react";
import { Users, Star, UserCheck, Activity } from "lucide-react";
import { DFStatCard } from "../../../components/ui";

const StatsSection = ({ users }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const total = safeUsers.length;
  const proCount = safeUsers.filter(u => u.isPro).length;
  const femalesCount = safeUsers.filter(u => u.gender === "female").length;
  const activeCount = safeUsers.filter(u => u.status === "active").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DFStatCard
        icon={Users}
        label="Comunidad Total"
        value={total}
      />
      <DFStatCard
        icon={Star}
        label="Alumnos PRO"
        value={proCount}
        trend={total > 0 ? Math.round((proCount / total) * 100) : 0}
      />
      <DFStatCard
        icon={Activity}
        label="Comunidad Femenina"
        value={femalesCount}
      />
      <DFStatCard
        icon={UserCheck}
        label="Usuarios Activos"
        value={activeCount}
      />
    </div>
  );
};

export default StatsSection;
