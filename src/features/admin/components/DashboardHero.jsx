import { DFContainer, DFBadge } from "../../../components/ui";

const DashboardHero = ({
  eyebrow,
  title,
  highlight,
  description,
  right,
}) => {
  return (
    <section className="border-b border-white/10">
      <DFContainer>
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end py-10">

          <div className="space-y-5">
            <DFBadge>{eyebrow}</DFBadge>

            <h1 className="df-display">
              {title}{" "}
              {highlight && (
                <span className="text-primary">
                  {highlight}
                </span>
              )}
            </h1>

            <p className="df-body max-w-2xl">
              {description}
            </p>
          </div>

          {right && (
            <div className="self-center">
              {right}
            </div>
          )}

        </div>
      </DFContainer>
    </section>
  );
};

export default DashboardHero;