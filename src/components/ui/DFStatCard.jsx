import React from 'react';
import clsx from 'clsx';
import DFCard from './DFCard';

const DFStatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "primary",
  className = ""
}) => {
  return (
    <DFCard className={clsx("df-stat-card", className)}>
      {Icon && (
        <div className="p-3 rounded-xl bg-df-primary/10 text-df-primary">
          <Icon size={24} />
        </div>
      )}
      <div className="text-center">
        <p className="df-stat-label mb-1">{label}</p>
        <h3 className="df-stat-number text-df-primary">{value}</h3>
      </div>
      {trend && (
        <div className={clsx(
          "text-xs font-bold px-2 py-1 rounded-full",
          trend > 0 ? "bg-df-success/10 text-df-success" : "bg-df-danger/10 text-df-danger"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </DFCard>
  );
};

export default DFStatCard;
