import { describe, it, expect } from "vitest";
import { cleanProgramName, extractThankYouLinkouts, groupPrograms, transformListings } from "..";

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

  it('limits programs per school with maxPrograms', () => {
    const result = transformListings(mockListings, { maxPrograms: 1 });
    expect(result[0].schools[0].locations[0].programs).toHaveLength(1);
  });

  it('caps total programs per school across multiple locations', () => {
    const multiLocation = [{
      name: "BAND1",
      message: "",
      schools: [{
        id: 1,
        displayName: "Test School",
        logo: { src: "http://logo.png", width: 100, height: 100 },
        locations: [
          {
            instructionMethod: "classroom",
            programs: [
              { programId: "1", displayName: "Business", degreeName: "Bachelor", programInfo: "" },
              { programId: "2", displayName: "Nursing", degreeName: "Associate", programInfo: "" },
            ],
          },
          {
            instructionMethod: "online",
            programs: [
              { programId: "3", displayName: "Technology", degreeName: "Bachelor", programInfo: "" },
              { programId: "4", displayName: "Arts", degreeName: "Associate", programInfo: "" },
            ],
          },
        ],
      }],
    }];

    const result = transformListings(multiLocation, { maxPrograms: 3 });
    const school = result[0].schools[0];
    const totalPrograms = school.locations.reduce((n, l) => n + l.programs.length, 0);
    expect(totalPrograms).toBe(3);
    expect(school.locations[0].programs).toHaveLength(2);
    expect(school.locations[1].programs).toHaveLength(1);
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

const logo = { src: "http://logo.png", width: 100, height: 100 };

describe('extractThankYouLinkouts', () => {
  it('returns only listings marked showOnThankYou', () => {
    const listings = [
      {
        name: "ZETABAND",
        message: "",
        showOnThankYou: true,
        schools: [{
          id: "zeta",
          displayName: "Zeta School",
          logo,
          locations: [{ instructionMethod: "Online", programs: [{ programId: "z1", displayName: "Prog A", degreeName: "", programInfo: "info", clickTrackingUrl: "http://click.com/z1" }] }],
        }],
      },
      {
        name: "BAND1",
        message: "",
        showOnThankYou: false,
        schools: [{
          id: 1,
          displayName: "Other School",
          logo,
          locations: [{ instructionMethod: "Online", programs: [{ programId: "o1", displayName: "Prog B", degreeName: "", programInfo: "info", clickTrackingUrl: "http://click.com/o1" }] }],
        }],
      },
    ];
    const result = extractThankYouLinkouts(listings);
    expect(result).toHaveLength(1);
    expect(result[0].programId).toBe("z1");
  });

  it('excludes programs without a clickTrackingUrl', () => {
    const listings = [{
      name: "ZETABAND",
      message: "",
      showOnThankYou: true,
      schools: [{
        id: "zeta",
        displayName: "Zeta School",
        logo,
        locations: [{ instructionMethod: "Online", programs: [
          { programId: "z1", displayName: "Prog A", degreeName: "", programInfo: "info", clickTrackingUrl: "http://click.com/z1" },
          { programId: "z2", displayName: "Prog B", degreeName: "", programInfo: "info" },
        ]}],
      }],
    }];
    const result = extractThankYouLinkouts(listings);
    expect(result).toHaveLength(1);
    expect(result[0].programId).toBe("z1");
  });

  it('preserves school logo on each linkout', () => {
    const listings = [{
      name: "ZETABAND",
      message: "",
      showOnThankYou: true,
      schools: [{
        id: "zeta",
        displayName: "Zeta School",
        logo,
        locations: [{ instructionMethod: "Online", programs: [{ programId: "z1", displayName: "Prog A", degreeName: "", programInfo: "info", clickTrackingUrl: "http://click.com/z1" }] }],
      }],
    }];
    const result = extractThankYouLinkouts(listings);
    expect(result[0].school.logo).toEqual(logo);
    expect(result[0].school.displayName).toBe("Zeta School");
  });

  it('flattens programs across multiple schools and locations', () => {
    const listings = [{
      name: "ZETABAND",
      message: "",
      showOnThankYou: true,
      schools: [
        {
          id: "s1",
          displayName: "School One",
          logo,
          locations: [
            { instructionMethod: "Online", programs: [{ programId: "p1", displayName: "Prog A", degreeName: "", programInfo: "", clickTrackingUrl: "http://click.com/p1" }] },
            { instructionMethod: "Campus", programs: [{ programId: "p2", displayName: "Prog B", degreeName: "", programInfo: "", clickTrackingUrl: "http://click.com/p2" }] },
          ],
        },
        {
          id: "s2",
          displayName: "School Two",
          logo,
          locations: [{ instructionMethod: "Online", programs: [{ programId: "p3", displayName: "Prog C", degreeName: "", programInfo: "", clickTrackingUrl: "http://click.com/p3" }] }],
        },
      ],
    }];
    const result = extractThankYouLinkouts(listings);
    expect(result).toHaveLength(3);
    expect(result.map((l) => l.programId)).toEqual(["p1", "p2", "p3"]);
  });

  it('returns empty array when no listings are marked showOnThankYou', () => {
    const result = extractThankYouLinkouts(mockListings);
    expect(result).toHaveLength(0);
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