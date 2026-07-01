import {
  DashboardHero,
} from "..";

const PageHeader = ({
  title,
  subtitle,
  actions,
}) => {
  return (
    <DashboardHero
      eyebrow="Panel"
      title={title}
      description={subtitle}
      right={actions}
    />
  );
};

export default PageHeader;