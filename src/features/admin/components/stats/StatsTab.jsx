import DashboardSection from "../DashboardSection";
import StatsCards from "./StatsCards";

const StatsTab = ({ users }) => {

  return (

    <DashboardSection
      title="Resumen General"
      subtitle="Estado actual de la academia."
    >

      <StatsCards users={users} />

    </DashboardSection>

  );

};

export default StatsTab;