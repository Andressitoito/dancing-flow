import clsx from "clsx";

const DFSelect = ({
  label,
  error,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">

      {label && (
        <label className="df-label">
          {label}
        </label>
      )}

      <select
        className={clsx(
          "df-input",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

    </div>
  );
};

export default DFSelect;