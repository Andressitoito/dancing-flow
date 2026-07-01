import React from 'react';
import clsx from 'clsx';

const DFPageActions = ({ children, className = "" }) => {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      {children}
    </div>
  );
};

export default DFPageActions;
