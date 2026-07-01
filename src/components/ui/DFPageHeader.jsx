import React from 'react';
import clsx from 'clsx';

const DFPageHeader = ({ title, subtitle, children, className = "" }) => {
  return (
    <header className={clsx("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
      <div className="flex-1">
        <h1 className="df-display mb-2">{title}</h1>
        {subtitle && <p className="df-body-lg text-df-text-soft max-w-2xl">{subtitle}</p>}
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
