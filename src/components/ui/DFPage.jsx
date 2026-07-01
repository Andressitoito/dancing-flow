import React from 'react';
import clsx from 'clsx';

const DFPage = ({ children, className = "", fullBleed = false }) => {
  return (
    <div className={clsx(
      "min-h-screen pt-20 pb-12 transition-colors duration-300",
      !fullBleed && "px-4 md:px-8",
      className
    )}>
      {children}
    </div>
  );
};

export default DFPage;
