import { describe, it, expect } from "vitest";
import { groupPrograms } from ".";

const mockListings = [
  {
    name: "BAND1",
    message: "",
    schools: [
      {
        id: 1,
        displayName: "Test School",
        logo: { url: "http://logo.png", width: 100, height: 100 },
        locations: [
          {
            instructionMethod: "classroom",
            programs: [
              {
                programId: "1",
                displayName: "Business",
                degreeName: "Bachelor",
                clickTrackingUrl: "",
              },
              {
                programId: "2",
                displayName: "Nursing",
                degreeName: "Associate",
                clickTrackingUrl: "http://click.com",
              },
            ],
          },
        ],
      },
    ],
  },
];

describe('groupPrograms', () => {
    it('separates rfis and linkouts', () => {
        const result = groupPrograms(mockListings);

        expect(result.rfis).toHaveLength(1);
        expect(result.linkouts).toHaveLength(1);

        expect(result.rfis[0].instructionMethod).toBe("classroom");
        expect(result.linkouts[0].instructionMethod).toBe("classroom");
    })
})