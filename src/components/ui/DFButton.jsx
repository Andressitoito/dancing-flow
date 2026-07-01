import clsx from "clsx";

const variants = {
  primary: "df-button-primary",
  secondary: "df-button-secondary",
  ghost: "df-button-ghost",
  danger: "df-button-danger",
};

const sizes = {
  xs: "h-8 px-3 text-xs",
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
  icon: "h-11 w-11 p-0",
};

const DFButton = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  as: Component = "button",
  disabled,
  ...props
}) => {
  return (
    <Component
      disabled={disabled || loading}
      className={clsx(
        "df-button df-button-text",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {LeftIcon && <LeftIcon size={18} />}
          {children}
          {RightIcon && <RightIcon size={18} />}
        </>
      )}
    </Component>
  );
};

export default DFButton;
