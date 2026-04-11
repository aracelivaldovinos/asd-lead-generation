import { RawRFIResponse, RFIResponse } from "./types";

export const mockRawRFIResponse: RawRFIResponse = {
  displayName: "AS - Management - Associate's",
  schoolName: "Post University",
  schoolId: 28,
  logo: { src: "https://example.com/logo.jpg", width: 350, height: 149 },
  useLeadId: true,
  useTrustedForm: true,
  tcpaDisclaimer: "By pressing Request Info...",
  tcpaCheckboxRequired: false,
  disclaimer: null,
  privacyPolicy: "<p>Privacy policy...</p>",
  questions: {
    schema: {
      properties: {
        firstName: {
          title: "First name",
          type: "string",
          required: true,
          maxLength: 30,
          pattern: "[a-zA-Z]{2,}",
        },
        state: {
          title: "State/Province",
          type: "string",
          required: true,
          maxLength: 255,
          enum: ["AK", "AL"],
        },
        custom101: {
          title: "Do you have internet?",
          type: "string",
          required: true,
          maxLength: 255,
          enum: ["Yes", "No"],
        },
      },
    },
    options: {
      fields: {
        firstName: { type: "text" },
        state: { type: "select", optionLabels: ["Alaska", "Alabama"] },
        custom101: { type: "radio", optionLabels: ["Yes", "No"] },
      },
    },
  },
};

export const mockRFIResponse: RFIResponse = {
  displayName: "AS - Management - Associate's",
  schoolName: "Post University",
  schoolId: 28,
  logo: { src: "https://example.com/logo.jpg", width: 350, height: 149 },
  useLeadId: true,
  useTrustedForm: true,
  tcpaDisclaimer: "By pressing Request Info...",
  tcpaCheckboxRequired: false,
  questions: [
    {
      key: "firstName",
      title: "First name",
      type: "text",
      required: true,
      maxLength: 30,
      pattern: "[a-zA-Z]{2,}",
      options: null,
    },
    {
      key: "state",
      title: "State/Province",
      type: "select",
      required: true,
      maxLength: 255,
      pattern: null,
      options: [
        { value: "AK", displayName: "Alaska" },
        { value: "AL", displayName: "Alabama" },
      ],
    },
    {
      key: "custom101",
      title: "Do you have internet?",
      type: "radio",
      required: true,
      maxLength: 255,
      pattern: null,
      options: [
        { value: "Yes", displayName: "Yes" },
        { value: "No", displayName: "No" },
      ],
    },
  ],
};