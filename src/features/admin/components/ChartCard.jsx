import { DFCard } from "../../../components/ui";

const ChartCard = ({
  title,
  children,
  className = "",
}) => {
  return (
    <DFCard className={className}>

      <h3 className="df-heading-3 mb-6">
        {title}
      </h3>

      {children}

    </DFCard>
  );
};

export default ChartCard;