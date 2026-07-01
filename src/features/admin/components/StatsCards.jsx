import React from "react";
import { Users, Activity, Info } from "lucide-react";

import {
    StatsGrid,
    StatCard,
} from "../../../components/dashboard";

const StatsCards = ({ users }) => {

    const safeUsers = Array.isArray(users) ? users : [];

    const total = safeUsers.length;

    const males = safeUsers.filter(
        u => u.gender === "male"
    ).length;

    const females = safeUsers.filter(
        u => u.gender === "female"
    ).length;

    const unknown = safeUsers.filter(
        u => u.gender === "unidentified"
    ).length;

    return (

        <StatsGrid>

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
                value={unknown}
            />

        </StatsGrid>

    );

};

export default StatsCards;