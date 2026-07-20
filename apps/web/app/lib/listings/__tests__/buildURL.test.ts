import { describe, it, expect } from "vitest";
import { buildURL } from "../buildURL";
import { ProviderDef, RequestContext } from "../types";

const baseCtx: RequestContext = {
  query: { marketContext: "ahs", utm_medium: "seo", utm_source: "google" },
  headers: {},
  meta: { dom_current: "https://example.com", session: "abc123" },
  session: "abc123",
  fp: "fp123",
};

const baseProvider: ProviderDef = {
  id: "test",
  name: "Test Provider",
  host: "https://example.com",
  path: "/api/listings",
  method: "GET",
  params: [],
};

describe("buildURL", () => {
  it("builds base URL from host and path", () => {
    const url = buildURL(baseProvider, baseCtx);
    expect(url.origin).toBe("https://example.com");
    expect(url.pathname).toBe("/api/listings");
  });

  it("sets hardcode params", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "hardcode", key: "offerType", value: "RFI" }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("offerType")).toBe("RFI");
  });

  it("sets passthrough param from query", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "mc", source: "query", sourceKey: "marketContext" }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("mc")).toBe("ahs");
  });

  it("sets passthrough param from cookie (meta)", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "dom_current", source: "cookie", sourceKey: "dom_current" }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("dom_current")).toBe("https://example.com");
  });

  it("sets passthrough param from header", () => {
    const ctx: RequestContext = { ...baseCtx, headers: { "user-agent": "Mozilla/5.0" } };
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "userAgent", source: "header", sourceKey: "user-agent" }],
    };
    const url = buildURL(provider, ctx);
    expect(url.searchParams.get("userAgent")).toBe("Mozilla/5.0");
  });

  it("uses fallback when primary source is missing", () => {
    const ctx: RequestContext = {
      ...baseCtx,
      query: { ...baseCtx.query },
      headers: { "x-zipcode": "90210" },
    };
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{
        type: "passthrough",
        key: "postalCode",
        source: "query",
        sourceKey: "postalCode",
        fallback: { source: "header", sourceKey: "x-zipcode" },
      }],
    };
    const url = buildURL(provider, ctx);
    expect(url.searchParams.get("postalCode")).toBe("90210");
  });

  it("uses default when source and fallback are missing", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "startDate", source: "query", sourceKey: "startDate", default: "1-3 months" }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("startDate")).toBe("1-3 months");
  });

  it("throws when required param is missing", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "marketContext", source: "query", sourceKey: "missing", required: true }],
    };
    expect(() => buildURL(provider, baseCtx)).toThrow("missing required param");
  });

  it("appends array values for passthrough params", () => {
    const ctx: RequestContext = { ...baseCtx, query: { ...baseCtx.query, degree: ["associates", "bachelors"] } };
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "degree", source: "query", sourceKey: "degree" }],
    };
    const url = buildURL(provider, ctx);
    expect(url.searchParams.getAll("degree")).toEqual(["associates", "bachelors"]);
  });

  it("resolves mapping param from lookup table", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{
        type: "mapping",
        key: "areaStudy",
        source: "query",
        sourceKey: "marketContext",
        values: { ahs: 5, unknown: 9 },
      }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("areaStudy")).toBe("5");
  });

  it("falls back to unknown in mapping when value not found", () => {
    const ctx: RequestContext = { ...baseCtx, query: { ...baseCtx.query, marketContext: "unrecognized" } };
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{
        type: "mapping",
        key: "areaStudy",
        source: "query",
        sourceKey: "marketContext",
        values: { ahs: 5, unknown: 9 },
      }],
    };
    const url = buildURL(provider, ctx);
    expect(url.searchParams.get("areaStudy")).toBe("9");
  });

  it("skips mapping param when no match and no unknown key", () => {
    const ctx: RequestContext = { ...baseCtx, query: { ...baseCtx.query, marketContext: "unrecognized" } };
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{
        type: "mapping",
        key: "areaStudy",
        source: "query",
        sourceKey: "marketContext",
        values: { ahs: 5 },
      }],
    };
    const url = buildURL(provider, ctx);
    expect(url.searchParams.has("areaStudy")).toBe(false);
  });

  it("sets computed param", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{
        type: "computed",
        key: "mPubCampaignID",
        compute: (ctx) => ctx.query["utm_medium"] === "seo" ? "67104" : "16160",
      }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.get("mPubCampaignID")).toBe("67104");
  });

  it("skips optional passthrough when value is missing", () => {
    const provider: ProviderDef = {
      ...baseProvider,
      params: [{ type: "passthrough", key: "military", source: "query", sourceKey: "military" }],
    };
    const url = buildURL(provider, baseCtx);
    expect(url.searchParams.has("military")).toBe(false);
  });
});
