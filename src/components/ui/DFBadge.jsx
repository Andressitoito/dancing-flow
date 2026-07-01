import clsx from "clsx";

const variants = {
  primary:
    "bg-primary/10 text-primary border border-primary/20",

  secondary:
    "bg-white/5 text-zinc-300 border border-white/10",

  success:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

  warning:
    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20",

  outline:
    "border border-primary/30 text-primary",
};

const sizes = {
  xs: "px-2 py-1 text-[10px]",
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

const DFBadge = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full uppercase tracking-wider font-semibold whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default DFBadge;