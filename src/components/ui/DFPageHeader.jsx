import React from 'react';
import clsx from 'clsx';

const DFPageHeader = ({ title, subtitle, children, className = "" }) => {
  return (
    <header className={clsx("flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5", className)}>
      <div className="space-y-1.5">
        <h1 className="font-sora text-3xl md:text-4xl font-extrabold text-white italic uppercase tracking-tighter leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-zinc-500 text-sm md:text-base font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
};

export default DFPageHeader;
