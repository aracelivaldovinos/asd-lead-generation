import { describe, expect, it } from "vitest";
import { transformFiltersResponse, transformPrefilter, selectPrefilterQuestions } from "../filters";
import { mockFiltersResponse, mockPrefilterQuestions, mockRawFiltersResponse } from "../mocks";

describe("transformFilterResponse", () => {
  it("tansforms filter questions", () => {
    const response = transformFiltersResponse(mockRawFiltersResponse);
    expect(response).toStrictEqual(mockFiltersResponse);
  });
});

describe("transformPrefilter", () => {
  it("transforms prefilter questions", () => {
    const questions = transformPrefilter(mockRawFiltersResponse);
    expect(questions).toStrictEqual(mockPrefilterQuestions);
  });

  it("maps options with optionLabels as displayName", () => {
    const questions = transformPrefilter(mockRawFiltersResponse);
    const hsGraduation = questions.find((q) => q.key === "hsGraduation");
    expect(hsGraduation?.options).toStrictEqual([
      { value: "", displayName: "- Select One -" },
      { value: "2026", displayName: "2026" },
      { value: "2025", displayName: "2025" },
      { value: "2024", displayName: "2024" },
    ]);
  });

  it("sets options to null for questions without enum", () => {
    const questions = transformPrefilter(mockRawFiltersResponse);
    const postalCode = questions.find((q) => q.key === "postalCode");
    expect(postalCode?.options).toBeNull();
  });

  it("sets pattern to null when not defined", () => {
    const questions = transformPrefilter(mockRawFiltersResponse);
    const postalCode = questions.find((q) => q.key === "postalCode");
    expect(postalCode?.pattern).toBeNull();
  });

  it("appends subjectArea from filter as a prefilter question", () => {
    const questions = transformPrefilter(mockRawFiltersResponse);
    const subjectArea = questions.find((q) => q.key === "subjectArea");
    expect(subjectArea).toStrictEqual({
      key: "subjectArea",
      title: "Field of Study",
      type: "select",
      required: true,
      maxLength: 255,
      pattern: null,
      options: [
        { value: "", displayName: "All" },
        { value: "business-administration-mba-concentration", displayName: "Business Administration / MBA" },
        { value: "computer-science-concentration", displayName: "Computer Science Programs" },
      ],
    });
  });
});

describe("selectPrefilterQuestions", () => {
  it("returns only the questions matching the given keys", () => {
    const result = selectPrefilterQuestions(mockPrefilterQuestions, ["postalCode", "subjectArea"]);
    expect(result.map((q) => q.key)).toStrictEqual(["postalCode", "subjectArea"]);
  });

  it("preserves the order of the provided keys", () => {
    const result = selectPrefilterQuestions(mockPrefilterQuestions, ["subjectArea", "postalCode"]);
    expect(result.map((q) => q.key)).toStrictEqual(["subjectArea", "postalCode"]);
  });

  it("omits keys that do not exist in the questions", () => {
    const result = selectPrefilterQuestions(mockPrefilterQuestions, ["postalCode", "nonExistent"]);
    expect(result.map((q) => q.key)).toStrictEqual(["postalCode"]);
  });

  it("returns an empty array when no keys match", () => {
    const result = selectPrefilterQuestions(mockPrefilterQuestions, ["nonExistent"]);
    expect(result).toStrictEqual([]);
  });
});