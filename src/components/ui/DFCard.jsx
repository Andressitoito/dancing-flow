import React from 'react';
import clsx from 'clsx';

const DFCard = ({
  children,
  className = "",
  variant = "default",
  noPadding = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "df-card",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default DFCard;
