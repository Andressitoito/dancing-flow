import React from 'react';
import clsx from 'clsx';

const DFPage = ({ children, className }) => {
  return (
    <div className={clsx("min-h-screen", className)}>
      {children}
    </div>
  );
};

export default DFPage;
