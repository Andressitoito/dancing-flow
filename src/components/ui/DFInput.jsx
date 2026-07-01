import React from 'react';
import clsx from 'clsx';

const DFInput = ({
  label,
  error,
  className = "",
  containerClassName = "",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="df-label ml-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-4 text-df-text-muted">
            <LeftIcon size={18} />
          </div>
        )}

        <input
          className={clsx(
            "df-input w-full transition-all duration-200 outline-none",
            "focus:border-df-primary/40 focus:bg-df-surface-3",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            LeftIcon && "pl-12",
            RightIcon && "pr-12",
            error ? "border-df-danger" : "border-df-border",
            className
          )}
          {...props}
        />

        {RightIcon && (
          <div className="absolute right-4 text-df-text-muted">
            <RightIcon size={18} />
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-df-danger ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default DFInput;
