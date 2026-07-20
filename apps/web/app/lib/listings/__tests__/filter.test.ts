import { describe, it, expect } from "vitest";
import { resolveListingGroups, filterListings, splitWebUIListings } from "../filter";
import { Listing } from "@asd/domain";

const makeListing = (schoolCount: number, id = "x"): Listing => ({
  name: "BAND",
  message: "",
  schools: Array.from({ length: schoolCount }, (_, i) => ({
    id: `${id}-school-${i}`,
    displayName: `School ${i}`,
    logo: { src: "", width: 0, height: 0 },
    locations: [
      {
        instructionMethod: "Online",
        programs: [
          { programId: `${id}-p-${i}`, displayName: "Program", degreeName: "", programInfo: "", clickTrackingUrl: "https://click.com" },
          { programId: `${id}-p-${i}-2`, displayName: "Program 2", degreeName: "", programInfo: "", clickTrackingUrl: "https://click.com" },
        ],
      },
    ],
  })),
});

describe("splitWebUIListings", () => {
  const rfiListing: Listing = {
    name: "BAND1",
    message: "",
    schools: [{
      id: "s1", displayName: "School A", logo: { src: "", width: 0, height: 0 },
      locations: [{ instructionMethod: "Online", programs: [
        { programId: "p1", displayName: "Nursing", degreeName: "", programInfo: "", clickTrackingUrl: "" },
      ]}],
    }],
  };

  const linkoutListing: Listing = {
    name: "BAND2",
    message: "",
    schools: [{
      id: "s2", displayName: "School B", logo: { src: "", width: 0, height: 0 },
      locations: [{ instructionMethod: "Online", programs: [
        { programId: "p2", displayName: "Business", degreeName: "", programInfo: "", clickTrackingUrl: "https://click.com" },
      ]}],
    }],
  };

  it("puts listings with no click URLs into rfi", () => {
    const { rfi, linkouts } = splitWebUIListings([rfiListing]);
    expect(rfi).toHaveLength(1);
    expect(linkouts).toHaveLength(0);
  });

  it("puts listings with click URLs into linkouts", () => {
    const { rfi, linkouts } = splitWebUIListings([linkoutListing]);
    expect(rfi).toHaveLength(0);
    expect(linkouts).toHaveLength(1);
  });

  it("splits mixed response correctly", () => {
    const { rfi, linkouts } = splitWebUIListings([rfiListing, linkoutListing]);
    expect(rfi).toHaveLength(1);
    expect(linkouts).toHaveLength(1);
    expect(rfi[0].name).toBe("BAND1");
    expect(linkouts[0].name).toBe("BAND2");
  });

  it("returns empty arrays for empty input", () => {
    const { rfi, linkouts } = splitWebUIListings([]);
    expect(rfi).toHaveLength(0);
    expect(linkouts).toHaveLength(0);
  });

  it("does not mutate original listings", () => {
    const input = [rfiListing, linkoutListing];
    splitWebUIListings(input);
    expect(input).toHaveLength(2);
  });
});

describe("resolveListingGroups", () => {
  it("returns first group when it has results", () => {
    const results = {
      rfi: [makeListing(2, "rfi")],
      linkouts: [makeListing(1, "lo")],
      mm: [makeListing(1, "mm")],
    };
    const { listings: output } = resolveListingGroups(results, [["rfi", "linkouts"], ["mm"]]);
    const ids = output.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("rfi-school-0");
    expect(ids).toContain("lo-school-0");
    expect(ids).not.toContain("mm-school-0");
  });

  it("falls through to second group when first is empty", () => {
    const results = {
      rfi: [],
      linkouts: [],
      mm: [makeListing(1, "mm")],
    };
    const { listings: output } = resolveListingGroups(results, [["rfi", "linkouts"], ["mm"]]);
    const ids = output.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("mm-school-0");
  });

  it("falls through multiple groups", () => {
    const results = { rfi: [], mm: [], zeta: [makeListing(1, "zeta")] };
    const { listings: output } = resolveListingGroups(results, [["rfi"], ["mm"], ["zeta"]]);
    const ids = output.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("zeta-school-0");
  });

  it("combines providers within a group in order", () => {
    const results = {
      linkouts: [makeListing(1, "lo")],
      rfi: [makeListing(1, "rfi")],
    };
    const { listings: output } = resolveListingGroups(results, [["linkouts", "rfi"]]);
    expect(output[0].schools[0].id).toMatch(/lo/);
    expect(output[1].schools[0].id).toMatch(/rfi/);
  });

  it("truncates with maxSchools and maxPrograms", () => {
    const results = { mm: [makeListing(3, "mm")] };
    const { listings: output } = resolveListingGroups(results, [["mm"]], { maxSchools: 2, maxPrograms: 1 });
    expect(output[0].schools).toHaveLength(2);
    expect(output[0].schools[0].locations[0].programs).toHaveLength(1);
  });

  it("falls back to last group when none meet minResults", () => {
    const results = { rfi: [], zeta: [makeListing(1, "zeta")] };
    const { listings: output } = resolveListingGroups(results, [["rfi"], ["zeta"]], { minResults: 5 });
    const ids = output.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("zeta-school-0");
  });

  it("returns empty array when all groups are empty", () => {
    const results = { rfi: [], mm: [] };
    const { listings: output } = resolveListingGroups(results, [["rfi"], ["mm"]]);
    expect(output).toEqual([]);
  });

  it("handles missing provider ids gracefully", () => {
    const results = { rfi: [makeListing(1, "rfi")] };
    const { listings: output } = resolveListingGroups(results, [["rfi", "unknown"]]);
    const ids = output.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("rfi-school-0");
  });
});

describe("filterListings", () => {
  const listing: Listing = {
    name: "BAND1",
    message: "",
    schools: [
      {
        id: "school-1",
        displayName: "School One",
        logo: { src: "", width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              { programId: "p1", displayName: "Nursing", degreeName: "", programInfo: "", clickTrackingUrl: "" },
              { programId: "p2", displayName: "Business", degreeName: "", programInfo: "", clickTrackingUrl: "" },
            ],
          },
        ],
      },
      {
        id: "school-2",
        displayName: "School Two",
        logo: { src: "", width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              { programId: "p3", displayName: "Psychology", degreeName: "", programInfo: "", clickTrackingUrl: "" },
            ],
          },
        ],
      },
    ],
  };

  it("returns listings unchanged when no filter provided", () => {
    expect(filterListings([listing], {})).toEqual([listing]);
  });

  it("filters by organizationIds", () => {
    const result = filterListings([listing], { organizationIds: ["school-1"] });
    expect(result[0].schools).toHaveLength(1);
    expect(result[0].schools[0].id).toBe("school-1");
  });

  it("filters by programIds", () => {
    const result = filterListings([listing], { programIds: ["p1", "p3"] });
    const programs = result.flatMap((l) => l.schools.flatMap((s) => s.locations.flatMap((loc) => loc.programs)));
    expect(programs).toHaveLength(2);
    expect(programs.map((p) => p.programId)).toEqual(["p1", "p3"]);
  });

  it("removes schools with no matching programs", () => {
    const result = filterListings([listing], { programIds: ["p1"] });
    expect(result[0].schools).toHaveLength(1);
    expect(result[0].schools[0].id).toBe("school-1");
  });

  it("removes listings with no matching schools", () => {
    const result = filterListings([listing], { organizationIds: ["school-99"] });
    expect(result).toHaveLength(0);
  });

  it("applies both organizationIds and programIds", () => {
    const result = filterListings([listing], { organizationIds: ["school-1"], programIds: ["p2"] });
    expect(result[0].schools).toHaveLength(1);
    expect(result[0].schools[0].locations[0].programs).toHaveLength(1);
    expect(result[0].schools[0].locations[0].programs[0].programId).toBe("p2");
  });

  it("does not mutate original listings", () => {
    filterListings([listing], { programIds: ["p1"] });
    expect(listing.schools[0].locations[0].programs).toHaveLength(2);
  });
});
