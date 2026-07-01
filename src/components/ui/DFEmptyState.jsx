import React from 'react';
import { PackageOpen } from 'lucide-react';
import clsx from 'clsx';

const DFEmptyState = ({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className = ""
}) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center py-20 px-6 text-center glass-card border-dashed border-white/10", className)}>
      <div className="p-4 bg-white/5 rounded-full text-zinc-600 mb-4">
        <Icon size={40} />
      </div>
      <h3 className="font-sora text-xl font-bold text-white italic uppercase tracking-tight mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default DFEmptyState;
