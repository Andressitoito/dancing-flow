import { DFCard } from "../../../components/ui";

const ActionCard = ({
  icon,
  title,
  description,
  action,
}) => {

  return (
    <DFCard className="flex items-start gap-5">

      {icon && (
        <div className="text-primary mt-1">
          {icon}
        </div>
      )}

      <div className="flex-1">

        <h3 className="df-heading-3">
          {title}
        </h3>

        <p className="df-body mt-2">
          {description}
        </p>

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}

      </div>

    </DFCard>
  );

};

export default ActionCard;