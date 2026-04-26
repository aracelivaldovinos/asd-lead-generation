import { FiltersResponse, RawFiltersResponse } from "./types";

export const transformFiltersResponse = (response: RawFiltersResponse): FiltersResponse => {
  return {
    postalCode: {
      key: "postalCode",
      title: "ZIP or Postal Code",
      type: "input",
      options: null,
      pattern: "^(\\d{5}|[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d)$",
    },
    setting: {
      key: "setting",
      title: "Learning Format",
      type: "radio",
      options: response.filter.settings,
    },
    degree: {
      key: "degree",
      title: "Degree Level",
      type: "select",
      options: response.filter.degree,
    },
    subjectArea: {
      key: "subjectArea",
      title: "Field of Study",
      type: "select",
      options: response.filter.subjectArea.map(({ value, displayName }) => ({ value, displayName })),
    },
    specialization: {
      key: "specialization",
      title: "Concentration",
      type: "select",
      options: response.filter.subjectArea.flatMap(({ specialization }) =>
        specialization.map(({ value, displayName }) => ({ value, displayName }))
      ),
    },
    distance: {
      key: "distance",
      title: "Distance Range",
      type: "range",
      options: null,
      min: 0,
      max: 1000,
      step: 10,
    },
  };
};
