import React from 'react';
import clsx from 'clsx';

const DFContainer = ({
  children,
  className = "",
  size = "xl" // xl = 1440px
}) => {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1440px]",
    full: "max-w-none"
  };

  return (
    <div className={clsx("w-full mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </div>
  );
};

export default DFContainer;
