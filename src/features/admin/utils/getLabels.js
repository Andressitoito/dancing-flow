import { QUESTIONNAIRE_OPTIONS } from "../../../services/constants";

export function getLabels(field, ids) {
  if (!ids) return "Sin especificar";

  const idList = ids.split(",");

  return idList
    .map(
      (id) =>
        QUESTIONNAIRE_OPTIONS[field]?.find((o) => o.id === id)?.label || id
    )
    .join(", ");
}