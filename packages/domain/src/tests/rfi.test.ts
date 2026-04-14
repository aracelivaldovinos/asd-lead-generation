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
  contact: [],
  address: [
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
  academic: [],
  additional: [
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
