import { describe, it, expect } from "vitest";
import { processListings } from "../processListings";
import type { ClickConfig } from "../clickURL";
import type { ProviderRawResults } from "../fetchProviderResults";

const CLICK_CONFIG: ClickConfig = {
  searchParams: new URLSearchParams({ utm_medium: "seo" }),
  redirectServer: "https://redirect.example.com",
  appEnv: "production",
  mockUrl: "https://mock.example.com",
};

const rfiListing = {
  name: "BAND1",
  message: "",
  schools: [{
    id: "s1",
    displayName: "School A",
    logo: { src: "", width: 0, height: 0 },
    locations: [{ instructionMethod: "Online", programs: [
      { programId: "p1", displayName: "Nursing", degreeName: "", programInfo: "", clickTrackingUrl: "" },
    ]}],
  }],
};

const linkoutListing = {
  name: "BAND2",
  message: "",
  schools: [{
    id: "s2",
    displayName: "School B",
    logo: { src: "", width: 0, height: 0 },
    locations: [{ instructionMethod: "Online", programs: [
      { programId: "p2", displayName: "Business", degreeName: "", programInfo: "", clickTrackingUrl: "https://wui-click.com" },
    ]}],
  }],
};

const mmRaw = {
  result: [{
    mBrandID: "brand-1",
    mBrandName: "MM University",
    headContent: "MM Degree",
    bodyContent: "Get your degree",
    imageURL: "https://logo.png",
    clickURL: "https://mm-click.com",
  }],
};

const eddyRaw = {
  ads: [{
    adId: "eddy-1",
    institutionName: "Eddy University",
    logoMediumImage: "https://eddy-logo.png",
    header: "Criminal Justice",
    description: "Study online",
    clickThroughUrl: "https://eddy-click.com",
  }],
};

const emptyRaw: ProviderRawResults = { webui: { listings: [] }, mm: null, eddy: null };

describe("processListings", () => {
  it("returns rfi listings from webui", () => {
    const raw: ProviderRawResults = { webui: { listings: [rfiListing] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const ids = listings.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("s1");
  });

  it("returns linkout listings from webui", () => {
    const raw: ProviderRawResults = { webui: { listings: [linkoutListing] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const ids = listings.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("s2");
  });

  it("wraps linkout click URLs through redirect server", () => {
    const raw: ProviderRawResults = { webui: { listings: [linkoutListing] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const program = listings.flatMap((l) => l.schools.flatMap((s) => s.locations.flatMap((loc) => loc.programs)))
      .find((p) => p.programId === "p2");
    expect(new URL(program!.clickTrackingUrl!).origin).toBe("https://redirect.example.com");
  });

  it("leaves rfi click URLs empty", () => {
    const raw: ProviderRawResults = { webui: { listings: [rfiListing] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const program = listings.flatMap((l) => l.schools.flatMap((s) => s.locations.flatMap((loc) => loc.programs)))
      .find((p) => p.programId === "p1");
    expect(program!.clickTrackingUrl).toBe("");
  });

  it("maps mm results when provided", () => {
    const raw: ProviderRawResults = { webui: { listings: [] }, mm: mmRaw, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const ids = listings.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("brand-1");
  });

  it("maps eddy results when provided", () => {
    const raw: ProviderRawResults = { webui: { listings: [] }, mm: null, eddy: eddyRaw };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG, [["eddy"]]);
    const ids = listings.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("eddy-1");
  });

  it("always includes zeta when in groups", () => {
    const { listings } = processListings(emptyRaw, "my-session", CLICK_CONFIG, [["zeta"]]);
    expect(listings[0].name).toBe("ZETABAND");
  });

  it("includes session in zeta click URL", () => {
    const { listings } = processListings(emptyRaw, "my-session", CLICK_CONFIG, [["zeta"]]);
    const clickUrl = listings[0].schools[0].locations[0].programs[0].clickTrackingUrl!;
    expect(clickUrl).toContain("s2=my-session");
  });

  it("handles null mm gracefully", () => {
    const raw: ProviderRawResults = { webui: { listings: [rfiListing] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG, [["rfi", "linkouts"], ["mm"]]);
    expect(listings.length).toBeGreaterThan(0);
  });

  it("falls through to second group when webui is empty", () => {
    const raw: ProviderRawResults = { webui: { listings: [] }, mm: mmRaw, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG);
    const ids = listings.flatMap((l) => l.schools.map((s) => s.id));
    expect(ids).toContain("brand-1");
    expect(ids).not.toContain("s1");
  });

  it("respects group ordering — linkouts before rfi", () => {
    const raw: ProviderRawResults = {
      webui: { listings: [rfiListing, linkoutListing] },
      mm: null,
      eddy: null,
    };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG, [["linkouts", "rfi"]]);
    expect(listings[0].schools[0].id).toBe("s2"); // linkout first
    expect(listings[1].schools[0].id).toBe("s1"); // rfi second
  });

  it("applies maxSchools truncation", () => {
    const manySchools = {
      name: "BAND1",
      message: "",
      schools: Array.from({ length: 5 }, (_, i) => ({
        id: `school-${i}`,
        displayName: `School ${i}`,
        logo: { src: "", width: 0, height: 0 },
        locations: [{ instructionMethod: "Online", programs: [
          { programId: `p-${i}`, displayName: "Program", degreeName: "", programInfo: "", clickTrackingUrl: "" },
        ]}],
      })),
    };
    const raw: ProviderRawResults = { webui: { listings: [manySchools] }, mm: null, eddy: null };
    const { listings } = processListings(raw, "session-1", CLICK_CONFIG, [["rfi"]], { maxSchools: 2 });
    expect(listings[0].schools).toHaveLength(2);
  });

  it("handles missing webui listings gracefully", () => {
    const raw: ProviderRawResults = { webui: {}, mm: null, eddy: null };
    expect(() => processListings(raw, "session-1", CLICK_CONFIG)).not.toThrow();
  });

  it("sets fallback message when falling through to sponsored listings", () => {
    const raw: ProviderRawResults = { webui: { listings: [] }, mm: mmRaw, eddy: null };
    const { message } = processListings(raw, "session-1", CLICK_CONFIG);
    expect(message).toBeTruthy();
  });

  it("sets no-results message when all providers are empty", () => {
    const { message } = processListings(emptyRaw, "session-1", CLICK_CONFIG, [["rfi"], ["mm"]]);
    expect(message).toBeTruthy();
  });

  it("sets no message when webui has results", () => {
    const raw: ProviderRawResults = { webui: { listings: [rfiListing] }, mm: null, eddy: null };
    const { message } = processListings(raw, "session-1", CLICK_CONFIG);
    expect(message).toBeUndefined();
  });
});
