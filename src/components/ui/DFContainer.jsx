import clsx from "clsx";

const sizes = {
  xs: "max-w-3xl",
  sm: "max-w-5xl",
  md: "max-w-7xl",
  lg: "max-w-[1600px]",
  full: "w-full",
};

const DFContainer = ({
  children,
  className = "",
  size = "md",
  as: Component = "div",
}) => {
  return (
    <Component
      className={clsx(
        "mx-auto w-full px-4 md:px-6 xl:px-8",
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default DFContainer;