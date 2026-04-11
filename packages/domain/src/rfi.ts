import { RawRFIResponse, RFIResponse } from "./types";

export const transformRFIResponse = (response: RawRFIResponse): RFIResponse => {
  const properties = response.questions.schema.properties;
  const fields = response.questions.options.fields;

  const questions = Object.entries(properties).map(([key, property]) => {
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

  return {
    displayName: response.displayName,
    schoolName: response.schoolName,
    schoolId: response.schoolId,
    logo: response.logo,
    useLeadId: response.useLeadId,
    useTrustedForm: response.useTrustedForm,
    tcpaDisclaimer: response.tcpaDisclaimer,
    tcpaCheckboxRequired: response.tcpaCheckboxRequired,
    questions,
  };
};
