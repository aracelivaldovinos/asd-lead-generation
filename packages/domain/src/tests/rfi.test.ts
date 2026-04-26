import { describe, it, expect } from "vitest";
import { groupRFIQuestions, transformRFIResponse } from "../rfi";
import { mockRawRFIResponse, mockRFIResponse } from "../mocks";

const mockGroupRFIQuestions = {
  personal: [
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
      key: "lastName",
      title: "Last name",
      type: "text",
      required: true,
      maxLength: 30,
      pattern: "[a-zA-Z]{2,}",
      options: null,
    },
  ],
  contact: [
    {
      "key": "emailAddress",
      "maxLength": 255,
      "options": null,
      "pattern": null,
      "required": true,
      "title": "Email Address",
      "type": "email",
    },
    {
      "key": "primaryPhone",
      "maxLength": 15,
      "options": null,
      "pattern": "[0-9]{10}",
      "required": true,
      "title": "Phone Number",
      "type": "tel",
    },
  ],
  address: [
    {
      "key": "address",
      "maxLength": 255,
      "options": null,
      "pattern": null,
      "required": false,
      "title": "Address",
      "type": "text",
    },
    {
      "key": "city",
      "maxLength": 255,
      "options": null,
      "pattern": null,
      "required": false,
      "title": "City",
      "type": "text",
    },
    {
      "key": "postalCode",
      "maxLength": 10,
      "options": null,
      "pattern": "[0-9]{5}",
      "required": false,
      "title": "Postal Code",
      "type": "text",
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
  ],
  academic: [
    {
      "key": "military",
      "maxLength": 255,
      "options": [
        {
          "displayName": "- Select One -",
          "value": "",
        },
        {
          "displayName": "None",
          "value": "None",
        },
        {
          "displayName": "Active Duty",
          "value": "Active Duty",
        },
        {
          "displayName": "Dept of Defense",
          "value": "Dept of Defense",
        },
        {
          "displayName": "Reserve",
          "value": "Reserve",
        },
        {
          "displayName": "Veteran",
          "value": "Veteran",
        },
        {
          "displayName": "Spouse",
          "value": "Spouse",
        },
        {
          "displayName": "Prefer not to disclose",
          "value": "Prefer not to disclose",
        },
      ],
      "pattern": null,
      "required": true,
      "title": "U.S. military affiliation",
      "type": "select",
    },
    {
      "key": "startDate",
      "maxLength": 255,
      "options": [
        {
          "displayName": "- Select One -",
          "value": "",
        },
        {
          "displayName": "Within 1 month",
          "value": "Within 1 month",
        },
        {
          "displayName": "1-3 months",
          "value": "1-3 months",
        },
        {
          "displayName": "4-6 months",
          "value": "4-6 months",
        },
        {
          "displayName": "7 months or more",
          "value": "7 months or more",
        },
      ],
      "pattern": null,
      "required": true,
      "title": "Expected start date",
      "type": "select",
    },
  ],
  additional: [
    {
      key: "custom[101]",
      title: "Do you currently have a computer at home with internet access?",
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

describe("transformRFIResponse", () => {
  it("tansforms rfi questions", () => {
    const response = transformRFIResponse(mockRawRFIResponse);
    expect(response).toStrictEqual(mockRFIResponse);
  });
});

describe("groupRFIQuestions", () => {
  it("groups questions based on field key", () => {
    const mockRFIQuestions = mockRFIResponse.questions;

    const groupedQuestions = groupRFIQuestions(mockRFIQuestions);

    expect(groupedQuestions).toStrictEqual(mockGroupRFIQuestions);
  });
});
