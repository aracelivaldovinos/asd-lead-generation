import { describe, expect, it } from "vitest";
import { transformFiltersResponse } from "../filters";
import { mockFiltersResponse, mockRawFiltersResponse } from "../mocks";

describe("transformFilterResponse", () => {
  it("tansforms filter questions", () => {
    const response = transformFiltersResponse(mockRawFiltersResponse);
    expect(response).toStrictEqual(mockFiltersResponse);
  });
});