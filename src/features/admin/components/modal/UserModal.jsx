import {
  Users,
  X,
  Target,
  Zap,
  Info,
  Award,
} from "lucide-react";

import { getLabels } from "../../utils/getLabels";

const sections = [
  {
    label: "Motivación Inicial",
    field: "whyStarted",
    icon: Target,
  },
  {
    label: "Objetivos",
    field: "objectives",
    icon: Award,
  },
  {
    label: "Puntos Críticos",
    field: "hardestPart",
    icon: Zap,
  },
  {
    label: "Miedos",
    field: "fears",
    icon: Info,
  },
];

const UserModal = ({
  user,
  modalRef,
  onClose,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-6">

      <div
        ref={modalRef}
        className="glass-card w-full max-w-6xl overflow-hidden"
      >

        <header className="flex justify-between items-center p-8 border-b border-primary/10">

          <div className="flex items-center gap-5">

            <Users
              size={30}
              className="text-primary"
            />

            <div>

              <p className="label-luxury">
                Expediente
              </p>

              <h2 className="df-heading-1">
                {user.username}
              </h2>

            </div>

          </div>

          <button
            className="btn-secondary"
            onClick={onClose}
          >
            <X size={20} />
          </button>

        </header>

        <div className="grid lg:grid-cols-2 gap-6 p-8">

          {sections.map((section) => {

            const Icon = section.icon;

            return (

              <div
                key={section.field}
                className="df-card"
              >

                <div className="flex items-center gap-3 mb-4">

                  <Icon
                    size={16}
                    className="text-primary"
                  />

                  <span className="label-luxury">
                    {section.label}
                  </span>

                </div>

                <p className="df-body-lg italic">

                  "
                  {getLabels(
                    section.field,
                    user.Questionnaire?.[section.field]
                  )}
                  "

                </p>

              </div>

            );

          })}

        </div>

        <div className="grid md:grid-cols-3 gap-5 p-8 pt-0">

          <div className="df-card text-center">

            <span className="label-luxury">
              Dedicación
            </span>

            <p className="df-heading-3 mt-3">
              {user.Questionnaire?.weeklyDedication ||
                "No informada"}
            </p>

          </div>

          <div className="df-card text-center">

            <span className="label-luxury">
              Grabación
            </span>

            <p className="df-heading-3 mt-3">

              {getLabels(
                "recordingPreference",
                user.Questionnaire
                  ?.recordingPreference
              )}

            </p>

          </div>

          <div className="df-card text-center">

            <span className="label-luxury">
              Nivel
            </span>

            <p className="df-heading-3 mt-3">

              {user.Questionnaire
                ?.experienceLevel || "Principiante"}

            </p>

          </div>

        </div>

        {user.Questionnaire
          ?.physicalLimitations && (

          <div className="p-8 pt-0">

            <div className="df-card border-red-500/30">

              <span className="label-luxury text-red-400">

                Observaciones

              </span>

              <p className="df-body-lg mt-4 italic">

                "

                {
                  user.Questionnaire
                    .physicalLimitations
                }

                "

              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default UserModal;