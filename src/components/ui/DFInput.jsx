import clsx from "clsx";

const DFInput = ({
  label,
  error,
  helper,
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

      <input
        className={clsx(
          "df-input",
          error && "border-red-500",
          className
        )}
        {...props}
      />

      {helper && !error && (
        <p className="text-xs text-zinc-500">
          {helper}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

    </div>
  );
};

export default DFInput;