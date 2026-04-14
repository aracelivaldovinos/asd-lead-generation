import { RawRFIResponse, RFIQuestion, RFIResponse } from "./types";

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
    disclaimer: response.disclaimer ?? "",
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

const PERSONAL_KEYS = ["firstName", "lastName", "age", "birthDate", "alternatePhone"];
const CONTACT_KEYS = ["emailAddress", "primaryPhone", "secondaryPhone", "contactTime", "contactPermission"];
const ADDRESS_KEYS = ["address", "city", "state", "postalCode"];
const ACADEMIC_KEYS = ["hsGraduation", "education", "gpa", "military", "startDate", "usCitizen"];

export const groupRFIQuestions = (questions: RFIQuestion[]) => {
  return questions.reduce(
    (groups, question) => {
      if (PERSONAL_KEYS.includes(question.key)) {
        groups.personal.push(question);
      } else if (CONTACT_KEYS.includes(question.key)) {
        groups.contact.push(question);
      } else if (ADDRESS_KEYS.includes(question.key)) {
        groups.address.push(question);
      } else if (ACADEMIC_KEYS.includes(question.key)) {
        groups.academic.push(question);
      } else {
        groups.additional.push(question);
      }
      return groups;
    },
    { personal: [], contact: [], address: [], academic: [], additional: [] } as Record<string, RFIQuestion[]>
  );
};
