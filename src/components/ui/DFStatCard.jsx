import React from 'react';
import DFCard from './DFCard';
import clsx from 'clsx';

const DFStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  className = ""
}) => {
  return (
    <DFCard padding="sm" className={clsx("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {Icon && <Icon size={20} />}
        </div>
        {trendValue !== undefined && (
          <span className={clsx(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
        )}
      </div>

      <div>
        <p className="df-label !text-[10px] !tracking-widest !text-zinc-500 mb-1 uppercase">{label}</p>
        <h3 className="font-sora text-2xl font-bold text-white italic tracking-tighter">
          {value}
        </h3>
      </div>
    </DFCard>
  );
};

export default DFStatCard;
