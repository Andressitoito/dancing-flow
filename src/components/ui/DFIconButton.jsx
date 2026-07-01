import clsx from "clsx";

const variants = {

  primary:
    "text-primary hover:bg-primary/10",

  danger:
    "text-red-400 hover:bg-red-500/10",

  neutral:
    "text-zinc-400 hover:text-white hover:bg-white/5",

};

const DFIconButton = ({
  children,
  variant = "neutral",
  className = "",
  ...props
}) => {

  return (

    <button

      className={clsx(

        "w-10 h-10 rounded-lg flex items-center justify-center transition",

        variants[variant],

        className

      )}

      {...props}

    >

      {children}

    </button>

  );

};

export default DFIconButton;