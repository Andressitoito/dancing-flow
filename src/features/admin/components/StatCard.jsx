import { DFCard } from "../../../components/ui";

const StatCard = ({
  icon,
  label,
  value,
  accent = "text-primary",
}) => {
  return (
    <DFCard className="h-full flex flex-col items-center justify-center text-center py-8">

      {icon && (
        <div className="mb-5">
          {icon}
        </div>
      )}

      <p className="df-label text-zinc-500">
        {label}
      </p>

      <h3 className={`mt-3 text-5xl font-black italic ${accent}`}>
        {value}
      </h3>

    </DFCard>
  );
};

export default StatCard;