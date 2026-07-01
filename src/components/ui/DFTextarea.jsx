import clsx from "clsx";

const DFTextarea = ({
  label,
  error,
  rows = 5,
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

      <textarea
        rows={rows}
        className={clsx(
          "df-input resize-none",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

    </div>
  );
};

export default DFTextarea;