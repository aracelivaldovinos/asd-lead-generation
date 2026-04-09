import { describe, it, expect } from "vitest";
import { cleanProgramName, groupPrograms } from "..";

const mockListings = [
  {
    name: "BAND1",
    message: "",
    schools: [
      {
        id: 1,
        displayName: "Test School",
        logo: { src: "http://logo.png", width: 100, height: 100 },
        locations: [
          {
            instructionMethod: "classroom",
            programs: [
              {
                programId: "1",
                displayName: "Business",
                degreeName: "Bachelor",
                clickTrackingUrl: "",
                programInfo: 'programInfo'
              },
              {
                programId: "2",
                displayName: "Nursing",
                degreeName: "Associate",
                clickTrackingUrl: "http://click.com",
                programInfo: 'programInfo'
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
    });
});

describe('cleanProgramName', () => {
    it("removes trailing degree name", () => {
        expect(cleanProgramName("Practical Nursing - Diploma")).toBe("Practical Nursing");
      });

    it("removes leading acronym and trailing degree name", () => {
          expect(cleanProgramName("AS - Diagnostic Medical Sonography - Associate's")).toBe("Diagnostic Medical Sonography");
          expect(cleanProgramName("Psy.D. - Clinical Psychology - Doctorate")).toBe("Clinical Psychology");
      });

    it("removes setting", () => {
        expect(cleanProgramName("BSN - Nursing: RN to BSN (Online) - Bachelor's")).toBe("Nursing: RN to BSN");
    });

    it("handles edge cases", () => {
        expect(cleanProgramName('ABC')).toBe('ABC');
        expect(cleanProgramName('')).toBe('');
        expect(cleanProgramName(null)).toBe('');
        expect(cleanProgramName(undefined)).toBe('');
    })
});