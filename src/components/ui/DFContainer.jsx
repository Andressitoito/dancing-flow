import React from 'react';
import clsx from 'clsx';

const DFContainer = ({
  children,
  className = "",
  size = "xl",
  noPadding = false
}) => {
  const sizes = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-7xl",
    full: "max-w-none"
  };

  return (
    <div className={clsx(
      "w-full mx-auto",
      !noPadding && "px-4 md:px-8",
      sizes[size],
      className
    )}>
      {children}
    </div>
  );
};

export default DFContainer;
