import { describe, it, expect } from "vitest";
import { mapResponse, mapZeta } from "../mapResponse";
import { Listing } from "@asd/domain";

const mockListing: Listing = {
  name: "BAND1",
  message: "",
  schools: [
    {
      id: 1,
      displayName: "Test School",
      logo: { src: "http://logo.png", width: 100, height: 100 },
      locations: [
        {
          instructionMethod: "Online",
          programs: [
            { programId: "p1", displayName: "Nursing", degreeName: "Bachelor's", programInfo: "", clickTrackingUrl: "" },
          ],
        },
      ],
    },
  ],
};

describe("mapResponse — rfi/linkouts", () => {
  it("extracts listings from WebUI response", () => {
    const result = mapResponse({ listings: [mockListing] }, "rfi");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("BAND1");
  });

  it("returns same result for linkouts provider", () => {
    const result = mapResponse({ listings: [mockListing] }, "linkouts");
    expect(result).toHaveLength(1);
  });

  it("returns empty array when listings is missing", () => {
    const result = mapResponse({}, "rfi");
    expect(result).toEqual([]);
  });
});

describe("mapResponse — mm", () => {
  const mmResponse = {
    result: [
      {
        mBrandID: "brand-1",
        mBrandName: "Test University",
        headContent: "Business Degree",
        bodyContent: "Get your MBA online",
        imageURL: "https://logo.png",
        clickURL: "https://click.com/track",
      },
    ],
  };

  it("maps mm result to Listing[]", () => {
    const result = mapResponse(mmResponse, "mm");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("MMBAND");
    expect(result[0].schools[0].id).toBe("brand-1");
    expect(result[0].schools[0].displayName).toBe("Test University");
    expect(result[0].schools[0].locations[0].programs[0].displayName).toBe("Business Degree");
    expect(result[0].schools[0].locations[0].programs[0].clickTrackingUrl).toContain("https://click.com/track");
    expect(result[0].schools[0].locations[0].programs[0].clickTrackingUrl).toContain("clickParamName=sub3");
    expect(result[0].schools[0].locations[0].programs[0].programId).toBe("brand-1");
  });

  it("maps multiple mm results", () => {
    const response = { result: [mmResponse.result[0], { ...mmResponse.result[0], mBrandID: "brand-2" }] };
    const result = mapResponse(response, "mm");
    expect(result).toHaveLength(2);
  });
});

describe("mapResponse — eddy", () => {
  const eddyResponse = {
    ads: [
      {
        adId: "eddy-1",
        institutionName: "Eddy University",
        logoMediumImage: "https://eddy-logo.png",
        header: "Criminal Justice",
        description: "Study law enforcement online",
        clickThroughUrl: "https://eddy-click.com",
      },
    ],
  };

  it("maps eddy ads to Listing[]", () => {
    const result = mapResponse(eddyResponse, "eddy");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("EDDYBAND");
    expect(result[0].schools[0].id).toBe("eddy-1");
    expect(result[0].schools[0].displayName).toBe("Eddy University");
    expect(result[0].schools[0].locations[0].programs[0].displayName).toBe("Criminal Justice");
    expect(result[0].schools[0].locations[0].programs[0].clickTrackingUrl).toBe("https://eddy-click.com");
  });
});

describe("mapResponse — unknown provider", () => {
  it("returns empty array for unknown provider", () => {
    const result = mapResponse({}, "unknown");
    expect(result).toEqual([]);
  });
});

describe("mapZeta", () => {
  it("returns a single ZETABAND listing", () => {
    const result = mapZeta("session-abc");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("ZETABAND");
    expect(result[0].schools[0].displayName).toBe("GetanEducationOnline.com");
  });

  it("includes session in click URL", () => {
    const result = mapZeta("my-session-123");
    const clickURL = result[0].schools[0].locations[0].programs[0].clickTrackingUrl;
    expect(clickURL).toContain("s2=my-session-123");
  });

  it("always has clickTrackingUrl set", () => {
    const result = mapZeta("s");
    const program = result[0].schools[0].locations[0].programs[0];
    expect(program.clickTrackingUrl).toBeTruthy();
  });
});
