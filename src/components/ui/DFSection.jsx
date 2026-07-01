import clsx from "clsx";

import DFContainer from "./DFContainer";

const spacings = {
  xs: "py-6",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
};

const DFSection = ({
  children,
  spacing = "lg",
  container = "md",
  className = "",
}) => {
  return (
    <section className={clsx(spacings[spacing], className)}>
      <DFContainer size={container}>
        {children}
      </DFContainer>
    </section>
  );
};

export default DFSection;