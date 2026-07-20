import { describe, it, expect } from "vitest";
import { cleanProgramName, groupPrograms, transformListings } from "..";

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

describe('transformListings', () => {
  it('returns listings unchanged when no config provided', () => {
    const result = transformListings(mockListings);
    expect(result).toHaveLength(1);
    expect(result[0].schools).toHaveLength(1);
    expect(result[0].schools[0].locations[0].programs).toHaveLength(2);
  });

  it('cleans program displayNames', () => {
    const result = transformListings(mockListings);
    // "Business" has no prefix to strip — stays as-is
    expect(result[0].schools[0].locations[0].programs[0].displayName).toBe('Business');
  });

  it('limits schools per listing with maxSchools', () => {
    const listings = [{ ...mockListings[0], schools: [...mockListings[0].schools, ...mockListings[0].schools] }];
    const result = transformListings(listings, { maxSchools: 1 });
    expect(result[0].schools).toHaveLength(1);
  });

  it('limits programs per location with maxPrograms', () => {
    const result = transformListings(mockListings, { maxPrograms: 1 });
    expect(result[0].schools[0].locations[0].programs).toHaveLength(1);
  });

  it('filters out listings with no programs after truncation', () => {
    const result = transformListings(mockListings, { maxPrograms: 0 });
    expect(result).toHaveLength(0);
  });

  it('does not mutate the original listings', () => {
    const original = mockListings[0].schools[0].locations[0].programs.length;
    transformListings(mockListings, { maxPrograms: 1 });
    expect(mockListings[0].schools[0].locations[0].programs).toHaveLength(original);
  });
});

describe('groupPrograms', () => {
    it('separates rfis and linkouts', () => {
        const result = groupPrograms(mockListings);

        expect(result.rfis).toHaveLength(1);
        expect(result.linkouts).toHaveLength(1);

        expect(result.rfis[0].instructionMethod).toBe("classroom");
        expect(result.linkouts[0].instructionMethod).toBe("classroom");
    });
    it('should limit schools per listing when maxSchools is provided', () => {
        const result = groupPrograms(mockListings, {maxSchools: 1});

        expect(result.rfis).toHaveLength(1);
        expect(result.linkouts).toHaveLength(1);

        expect(result.rfis[0].instructionMethod).toBe("classroom");
        expect(result.linkouts[0].instructionMethod).toBe("classroom");
    });
    it('should limit program per listing when maxPrograms is provided', () => {
        const result = groupPrograms(mockListings, {maxPrograms: 1});

        expect(result.rfis).toHaveLength(1);
        expect(result.linkouts).toHaveLength(0);

        expect(result.rfis[0].instructionMethod).toBe("classroom");
    });
      it('should limit both school and program per listing when maxSchools and maxPrograms is provided', () => {
        const result = groupPrograms(mockListings, {maxPrograms: 1, maxSchools: 1});

        expect(result.rfis).toHaveLength(1);
        expect(result.linkouts).toHaveLength(0);

        expect(result.rfis[0].instructionMethod).toBe("classroom");
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