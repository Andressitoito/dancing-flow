import React from 'react';
import clsx from 'clsx';

const DFPage = ({ children, className = "", fullBleed = false }) => {
  return (
    <div className={clsx(
      "min-h-[calc(100vh-80px)] w-full flex flex-col",
      !fullBleed && "py-6 md:py-10",
      className
    )}>
      {children}
    </div>
  );
};

export default DFPage;
