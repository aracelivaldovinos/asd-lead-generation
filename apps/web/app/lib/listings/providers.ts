import { ProviderDef, ProviderParam } from "./types";

const MM_ORGANIC_MEDIUMS = ["seo", "direct", "inbound", "organic", "sem", "sem_cont", "email_h", "social", "sm_organic"];

const wuiParams = (offerType: string): ProviderParam[] => [
  { type: "hardcode", key: "offerType", value: offerType },
  { type: "passthrough", key: "dom_current", source: "cookie", sourceKey: "dom_current", required: true },
  { type: "passthrough", key: "dom_referer", source: "cookie", sourceKey: "dom_referer" },
  { type: "passthrough", key: "landing_url", source: "cookie", sourceKey: "landing_url" },
  { type: "passthrough", key: "session", source: "cookie", sourceKey: "session" },
  { type: "passthrough", key: "postalCode", source: "query", sourceKey: "postalCode", fallback: { source: "header", sourceKey: "x-zipcode" } },
  { type: "passthrough", key: "pingEnabled", source: "query", sourceKey: "pingEnabled", default: "true" },
  { type: "passthrough", key: "resultSize", source: "query", sourceKey: "resultSize" },
];

const mmParams: ProviderParam[] = [
  { type: "hardcode", key: "mPubID", value: "92670" },
  {
    type: "computed",
    key: "mPubCampaignID",
    compute: (ctx) => {
      const utm = String(ctx.query["utm_medium"] ?? "");
      return MM_ORGANIC_MEDIUMS.includes(utm) ? "67104" : "16160";
    },
  },
  {
    type: "mapping",
    key: "mediaType",
    source: "query",
    sourceKey: "utm_medium",
    values: {
      social: 1, sm_organic: 1, email_h: 2,
      seo: 3, direct: 3, inbound: 3, part: 3,
      sem: 4, sem_cont: 4,
      display: 6, display_g: 6,
      aff_net: 7, aff_g: 7, email_3p: 7, email_3p_g: 7,
    },
  },
  {
    type: "mapping",
    key: "mProgram",
    source: "query",
    sourceKey: "marketContext",
    values: {
      "abs-default": 100, "abs-sem": 100, "acols-business": 100,
      acjs: 200, acjssem: 200, "crimj-sem-funnels": 200, "acols-criminal-justice": 200,
      apsy: 300, apsysem: 300, "acols-psychology": 300,
      "technology-education-sem": 400, "acols-technology": 400,
      ahs: 500, "ahs-sem": 500, "ahs-semnb": 500, "acols-healthcare": 500,
      aes: 600, "aes-sem": 600, "acols-education": 600,
      "acols-liberal-arts": 800,
      ans: 1100, "ans-basic": 1100, "acols-nursing": 1100,
      unknown: 900,
    },
  },
  {
    type: "mapping",
    key: "areaStudy",
    source: "query",
    sourceKey: "marketContext",
    values: {
      "abs-default": 1, "abs-sem": 1, "acols-business": 1,
      acjs: 2, acjssem: 2, "crimj-sem-funnels": 2, "acols-criminal-justice": 2,
      apsy: 3, apsysem: 3, "acols-psychology": 3,
      "technology-education-sem": 4, "acols-technology": 4,
      ahs: 5, "ahs-sem": 5, "ahs-semnb": 5, "acols-healthcare": 5,
      aes: 6, "aes-sem": 6, "acols-education": 6,
      "acols-liberal-arts": 8,
      ans: 11, "ans-basic": 11, "acols-nursing": 11,
      unknown: 9,
    },
  },
  {
    type: "mapping",
    key: "highestEducation",
    source: "query",
    sourceKey: "education",
    values: { "1": 2, "2": 3, "3": 5, "4": 6, "5": 7, "6": 8, Unknown: 9, unknown: 9 },
  },
  { type: "passthrough", key: "gradYear", source: "query", sourceKey: "hsGraduation" },
  {
    type: "mapping",
    key: "degreeInterest",
    source: "query",
    sourceKey: "degree",
    values: {
      certificates: 1, diplomas: 1, "certificates-diplomas": 1, bootcamp: 1, credentials: 1,
      associates: 2, bachelors: 3, masters: 4, doctorate: 5,
      "postgraduate-certificate": 4, "all-degrees": 5, unknown: 5,
    },
  },
  {
    type: "mapping",
    key: "campusType",
    source: "query",
    sourceKey: "setting",
    values: { all: 1, online: 2, classroom: 3, unknown: 4 },
  },
  {
    type: "mapping",
    key: "militaryAffiliation",
    source: "query",
    sourceKey: "military",
    values: {
      None: 1, "Active Duty": 2, Veteran: 3, Reserve: 4, Spouse: 5, Dependent: 6, unknown: 7,
    },
  },
  {
    type: "mapping",
    key: "startTimeframe",
    source: "query",
    sourceKey: "startDate",
    values: {
      "Within 1 month": 1, "1-3 months": 2, "4-6 months": 3, "7 months or more": 4, unknown: 6,
    },
  },
  { type: "passthrough", key: "zipCode", source: "query", sourceKey: "postalCode", fallback: { source: "header", sourceKey: "x-zipcode" } },
  { type: "passthrough", key: "sub1", source: "cookie", sourceKey: "session" },
  { type: "passthrough", key: "adsMax", source: "query", sourceKey: "maxSchools" },
  { type: "passthrough", key: "webInitiatingURL", source: "query", sourceKey: "webInitiatingUrl" },
  { type: "passthrough", key: "webLandingURL", source: "query", sourceKey: "webLandingUrl" },
];

const eddyParams: ProviderParam[] = [
  { type: "hardcode", key: "trackId", value: "3F5C5B29-C62C-42BF-8770-2173B898F1F5" },
  { type: "hardcode", key: "userIp", value: "null" },
  { type: "hardcode", key: "placementToken", value: "91114587-90eb-435b-abd8-f8f9b38908dd" },
  { type: "passthrough", key: "siteUrl", source: "cookie", sourceKey: "landing_url" },
  { type: "passthrough", key: "zipCode", source: "query", sourceKey: "postalCode", fallback: { source: "header", sourceKey: "x-zipcode" } },
  { type: "passthrough", key: "userAgent", source: "header", sourceKey: "user-agent" },
  { type: "passthrough", key: "highSchoolGradYear", source: "query", sourceKey: "hsGraduation" },
  { type: "passthrough", key: "urlReferer", source: "query", sourceKey: "webInitiatingUrl" },
  { type: "passthrough", key: "sub1", source: "cookie", sourceKey: "session" },
  {
    type: "mapping",
    key: "educationLevel",
    source: "query",
    sourceKey: "education",
    values: { "1": 1, "2": 3, "3": 4, "4": 8, "5": 9, "6": 10 },
  },
  { type: "passthrough", key: "rnLicense", source: "query", sourceKey: "nursingLicense" },
];

export const PROVIDER_CLICK_ENVS: Record<string, string[]> = {
  linkouts: [],
  mm: ["perf", "production"],
  eddy: ["production"],
  zeta: ["production"],
};

type ProvidersConfig = {
  webUiHost: string;
};

export const createProviders = (config: ProvidersConfig): Record<string, ProviderDef> => ({
  rfi: {
    id: "rfi",
    name: "ASD RFI",
    host: config.webUiHost,
    path: "/api/v3/listings",
    method: "GET",
    params: wuiParams("RFI"),
  },
  linkouts: {
    id: "linkouts",
    name: "ASD Linkouts",
    host: config.webUiHost,
    path: "/api/v3/listings",
    method: "GET",
    params: wuiParams("LINKOUT"),
  },
  mm: {
    id: "mm",
    name: "Media Matchers",
    host: "https://api.media-matchers.com",
    path: "/search",
    method: "GET",
    params: mmParams,
  },
  eddy: {
    id: "eddy",
    name: "Eddy",
    host: "https://ags.educationdynamics.com",
    path: "/api/listing",
    method: "POST",
    params: eddyParams,
  },
  zeta: {
    id: "zeta",
    name: "Zeta",
    host: "",
    path: "",
    method: "STATIC",
    params: [],
  },
});
