import React from 'react';
import clsx from 'clsx';

const DFPageHeader = ({ title, subtitle, children, className }) => {
  return (
    <header className={clsx("mb-12", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="df-display uppercase italic tracking-tighter text-df-text">{title}</h1>
          {subtitle && (
            <p className="df-label !text-df-primary opacity-80 uppercase tracking-[0.25em]">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
      <div className="h-px w-full bg-gradient-to-r from-df-primary/40 via-df-primary/10 to-transparent mt-8" />
    </header>
  );
};

export default DFPageHeader;
