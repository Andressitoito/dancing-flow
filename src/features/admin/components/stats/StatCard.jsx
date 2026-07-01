import { DFCard } from "../../../../components/ui";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "text-primary",
}) => {
  return (
    <DFCard className="h-full">

      <div className="flex items-start justify-between">

        <div>

          <p className="label-luxury mb-3">
            {label}
          </p>

          <h2 className="df-heading-1">
            {value}
          </h2>

        </div>

        <div
          className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${color}`}
        >
          <Icon size={22} />
        </div>

      </div>

    </DFCard>
  );
};

export default StatCard;