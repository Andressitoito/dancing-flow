import DashboardSection from "../DashboardSection";
import SegmentCard from "./SegmentCard";

import { QUESTIONNAIRE_OPTIONS } from "../../../../services/constants";

const SegmentationTab = ({
  users,
  onView,
}) => {

  return (

    <DashboardSection
      title="Segmentación"
      subtitle="Preferencias de grabación."
    >

      <div className="grid xl:grid-cols-2 gap-6">

        {QUESTIONNAIRE_OPTIONS.recordingPreference.map(
          (option) => {

            const filtered = users.filter(
              (user) =>
                user.Questionnaire
                  ?.recordingPreference === option.id
            );

            return (

              <SegmentCard
                key={option.id}
                label={option.label}
                users={filtered}
                onView={onView}
              />

            );

          }
        )}

      </div>

    </DashboardSection>

  );

};

export default SegmentationTab;