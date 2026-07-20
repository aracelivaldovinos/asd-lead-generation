import { describe, it, expect } from "vitest";
import { buildClickURL, applyClickURLs } from "../clickURL";
import { Listing } from "@asd/domain";

const BASE_CONFIG = {
  providerId: "linkouts",
  band: "BAND1",
  searchParams: new URLSearchParams({ utm_medium: "seo", marketContext: "ahs" }),
  redirectServer: "https://redirect.example.com",
  appEnv: "production",
  clickThroughEnvs: ["perf", "production"],
  mockUrl: "https://mock.example.com",
};

describe("buildClickURL", () => {
  it("returns empty string for rfi provider", () => {
    const result = buildClickURL("https://click.com", { ...BASE_CONFIG, providerId: "rfi" });
    expect(result).toBe("");
  });

  it("returns empty string for empty rawUrl", () => {
    const result = buildClickURL("", BASE_CONFIG);
    expect(result).toBe("");
  });

  it("passes mm click URL through unchanged in production", () => {
    const result = buildClickURL("https://mm-click.com", { ...BASE_CONFIG, providerId: "mm" });
    expect(result).toBe("https://mm-click.com");
  });

  it("returns mock URL for mm in non-production environment", () => {
    const result = buildClickURL("https://mm-click.com", {
      ...BASE_CONFIG, providerId: "mm", appEnv: "development",
    });
    expect(result).toBe("https://mock.example.com");
  });

  it("passes eddy click URL through unchanged in production", () => {
    const result = buildClickURL("https://eddy-click.com", { ...BASE_CONFIG, providerId: "eddy" });
    expect(result).toBe("https://eddy-click.com");
  });

  it("passes zeta click URL through unchanged in production", () => {
    const result = buildClickURL("https://zeta-click.com", { ...BASE_CONFIG, providerId: "zeta" });
    expect(result).toBe("https://zeta-click.com");
  });

  it("wraps linkouts click URL through redirect server", () => {
    const result = buildClickURL("https://wui-click.com", BASE_CONFIG);
    const url = new URL(result);
    expect(url.origin).toBe("https://redirect.example.com");
    expect(url.searchParams.get("provider-id")).toBe("linkouts");
  });

  it("encodes the click URL in asd-r-url param", () => {
    const result = buildClickURL("https://wui-click.com", BASE_CONFIG);
    const url = new URL(result);
    const encoded = url.searchParams.get("asd-r-url")!;
    expect(encoded).toContain("wui-click.com");
  });

  it("appends search params to click URL", () => {
    const result = buildClickURL("https://wui-click.com", BASE_CONFIG);
    const url = new URL(result);
    const clickUrl = new URL(url.searchParams.get("asd-r-url")!);
    expect(clickUrl.searchParams.get("utm_medium")).toBe("seo");
    expect(clickUrl.searchParams.get("marketContext")).toBe("ahs");
  });

  it("appends band to click URL", () => {
    const result = buildClickURL("https://wui-click.com", BASE_CONFIG);
    const url = new URL(result);
    const clickUrl = new URL(url.searchParams.get("asd-r-url")!);
    expect(clickUrl.searchParams.get("band")).toBe("BAND1");
  });

  it("uses mock URL for linkouts in non-production environment", () => {
    const result = buildClickURL("https://wui-click.com", { ...BASE_CONFIG, appEnv: "development" });
    const url = new URL(result);
    const clickUrl = new URL(url.searchParams.get("asd-r-url")!);
    expect(clickUrl.origin).toBe("https://mock.example.com");
  });

  it("falls back to raw URL when in non-production and no mockUrl", () => {
    const result = buildClickURL("https://wui-click.com", { ...BASE_CONFIG, appEnv: "development", mockUrl: "" });
    expect(result).toContain("wui-click.com");
  });

  it("returns click URL directly when no redirectServer configured", () => {
    const result = buildClickURL("https://wui-click.com", { ...BASE_CONFIG, redirectServer: "" });
    expect(result).toContain("wui-click.com");
    expect(result).not.toContain("redirect.example.com");
  });
});

describe("applyClickURLs", () => {
  const listing: Listing = {
    name: "BAND1",
    message: "",
    schools: [
      {
        id: "school-1",
        displayName: "Test University",
        logo: { src: "", width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              { programId: "p1", displayName: "Business", degreeName: "", programInfo: "", clickTrackingUrl: "https://wui-click.com" },
              { programId: "p2", displayName: "RFI Program", degreeName: "", programInfo: "", clickTrackingUrl: "" },
            ],
          },
        ],
      },
    ],
  };

  it("wraps linkouts click URLs through redirect server", () => {
    const result = applyClickURLs([listing], { ...BASE_CONFIG });
    const programs = result[0].schools[0].locations[0].programs;
    expect(new URL(programs[0].clickTrackingUrl!).origin).toBe("https://redirect.example.com");
  });

  it("leaves empty clickTrackingUrl untouched", () => {
    const result = applyClickURLs([listing], { ...BASE_CONFIG });
    const programs = result[0].schools[0].locations[0].programs;
    expect(programs[1].clickTrackingUrl).toBe("");
  });

  it("passes mm click URLs through unchanged in production", () => {
    const result = applyClickURLs([listing], { ...BASE_CONFIG, providerId: "mm" });
    const programs = result[0].schools[0].locations[0].programs;
    expect(programs[0].clickTrackingUrl).toBe("https://wui-click.com");
  });

  it("does not mutate original listings", () => {
    applyClickURLs([listing], { ...BASE_CONFIG });
    expect(listing.schools[0].locations[0].programs[0].clickTrackingUrl).toBe("https://wui-click.com");
  });
});
