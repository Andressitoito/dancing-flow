import { DFContainer } from "../../../components/ui";

const DashboardSection = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <section className="py-8">

      <DFContainer>

        {(title || actions) && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

            <div>
              {title && (
                <h2 className="df-heading-2">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="df-body mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            {actions}

          </div>
        )}

        {children}

      </DFContainer>
    </section>
  );
};

export default DashboardSection;