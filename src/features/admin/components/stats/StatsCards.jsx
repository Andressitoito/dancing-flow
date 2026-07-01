import {
  Users,
  Activity,
  Info,
} from "lucide-react";

import StatCard from "./StatCard";

const StatsCards = ({ users }) => {

  const total = users.length;

  const males = users.filter(
    (u) => u.gender === "male"
  ).length;

  const females = users.filter(
    (u) => u.gender === "female"
  ).length;

  const unidentified = users.filter(
    (u) => u.gender === "unidentified"
  ).length;

  return (

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        icon={Users}
        label="Total alumnos"
        value={total}
      />

      <StatCard
        icon={Activity}
        label="Mujeres"
        value={females}
      />

      <StatCard
        icon={Activity}
        label="Hombres"
        value={males}
      />

      <StatCard
        icon={Info}
        label="Sin datos"
        value={unidentified}
      />

    </div>

  );

};

export default StatsCards;