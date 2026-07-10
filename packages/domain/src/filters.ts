import { FiltersResponse, PrefilterQuestion, RawFiltersResponse } from "./types";

export const transformPrefilter = (response: RawFiltersResponse): PrefilterQuestion[] => {
  const properties = response.prefilter.schema.properties;
  const fields = response.prefilter.options.fields;

  const questions: PrefilterQuestion[] = Object.entries(properties).map(([key, property]) => {
    const field = fields[key];
    return {
      key,
      title: property.title,
      type: field.type,
      required: property.required,
      maxLength: property.maxLength,
      pattern: property.pattern ?? null,
      options: property.enum
        ? property.enum.map((value, index) => ({
            value,
            displayName: field.optionLabels?.[index] ?? value,
          }))
        : null,
    };
  });

  questions.push({
    key: "subjectArea",
    title: "Field of Study",
    type: "select",
    required: false,
    maxLength: 255,
    pattern: null,
    options: response.filter.subjectArea.map(({ value, displayName }) => ({ value, displayName })),
  });

  return questions;
};

export const selectPrefilterQuestions = (
  questions: PrefilterQuestion[],
  keys: string[]
): PrefilterQuestion[] =>
  keys
    .map((key) => questions.find((q) => q.key === key))
    .filter(Boolean) as PrefilterQuestion[];

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
      options: [{ value: "", displayName: "Both" }, ...response.filter.settings],
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
      options: response.filter.subjectArea.map(({ value, displayName, specialization }) => ({
        value,
        displayName,
        specializations: specialization.map(({ value, displayName }) => ({ value, displayName })),
      })),
    },
    specialization: {
      key: "specialization",
      title: "Field of Concentration",
      type: "select",
      options: [],
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
