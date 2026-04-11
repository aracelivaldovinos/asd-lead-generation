import { describe, it, expect } from "vitest";
import { transformRFIResponse } from "../rfi";
import { mockRawRFIResponse, mockRFIResponse } from "../mocks";

describe("transformRFIResponse", () => {
    it("it tansforms rfi questions", () => {
        const response = transformRFIResponse(mockRawRFIResponse);
        
        expect(response).toStrictEqual(mockRFIResponse);
    })
});
