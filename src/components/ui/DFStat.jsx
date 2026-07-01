import DFCard from "./DFCard";

const DFStat = ({
  icon: Icon,
  label,
  value,
}) => {

  return (

    <DFCard>

      <div className="flex justify-between items-start">

        <div>

          <div className="df-label mb-2">

            {label}

          </div>

          <div className="text-4xl font-bold font-sora">

            {value}

          </div>

        </div>

        {Icon && (

          <div className="text-primary">

            <Icon size={26} />

          </div>

        )}

      </div>

    </DFCard>

  );

};

export default DFStat;