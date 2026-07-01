import React from "react";
import { Users, Activity, UserCheck } from "lucide-react";
import { DFStatCard } from "../../../components/ui";

const StatsSection = ({ users }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const total = safeUsers.length;
  const males = safeUsers.filter(u => u.gender === "male").length;
  const females = safeUsers.filter(u => u.gender === "female").length;
  const pro = safeUsers.filter(u => u.isPro).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DFStatCard
        icon={Users}
        label="Total Alumnos"
        value={total}
      />
      <DFStatCard
        icon={UserCheck}
        label="Alumnos PRO"
        value={pro}
        trend="up"
        trendValue={total > 0 ? Math.round((pro / total) * 100) : 0}
      />
      <DFStatCard
        icon={Activity}
        label="Mujeres"
        value={females}
      />
      <DFStatCard
        icon={Activity}
        label="Hombres"
        value={males}
      />
    </div>
  );
};

export default StatsSection;
