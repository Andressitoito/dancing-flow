import { DFCard } from "../../../components/ui";

const EmptyState = ({
  icon,
  title,
  description,
  action,
}) => {

  return (
    <DFCard className="text-center py-16">

      {icon && (
        <div className="flex justify-center mb-6">
          {icon}
        </div>
      )}

      <h3 className="df-heading-3">
        {title}
      </h3>

      <p className="df-body mt-3 max-w-lg mx-auto">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}

    </DFCard>
  );

};

export default EmptyState;