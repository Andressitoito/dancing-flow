import clsx from "clsx";

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

const DFCard = ({
  children,
  className = "",
  padding = "md",
  hover = true,
  glass = true,
  border = true,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={clsx(
        "rounded-2xl transition-all duration-300",
        glass && "bg-[var(--df-surface-glass)] backdrop-blur-xl",
        border && "border border-[var(--df-border)]",
        hover &&
          "hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default DFCard;