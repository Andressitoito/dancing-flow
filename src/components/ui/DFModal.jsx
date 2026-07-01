import DFCard from "./DFCard";

const DFModal = ({
  children,
  open,
}) => {

  if (!open) return null;

  return (

    <div
      className="
      fixed
      inset-0
      z-50
      bg-black/80
      backdrop-blur-md
      flex
      items-center
      justify-center
      p-6
      "
    >

      <DFCard
        className="
        w-full
        max-w-5xl
        max-h-[90vh]
        overflow-auto
        "
      >

        {children}

      </DFCard>

    </div>

  );

};

export default DFModal;