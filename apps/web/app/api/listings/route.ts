import { type NextRequest, after } from "next/server";
import { fetchProviderResults } from "@/app/lib/listings/fetchProviderResults";
import { processListings } from "@/app/lib/listings/processListings";
import { parseMetaCookie, buildClickConfig } from "@/app/lib/listings/context";
import { fireImpressions } from "@/app/lib/listings/fireImpressions";
import { EXTERNAL_PROVIDERS } from "@/app/lib/listings/providers";
import type { RequestContext } from "@/app/lib/listings/types";

const OFFER_TYPE_MAP: Record<string, string> = { LINKOUT: "linkouts", RFI: "rfi" };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const metaValue = request.cookies.get("asd_s_meta")?.value ?? "";
  const { meta, session, fp } = parseMetaCookie(metaValue);

  // build params record — postalCode with Vercel IP fallback
  const params: Record<string, string | string[]> = {};

  const postalCode =
    searchParams.get("postalCode") ??
    request.headers.get("x-vercel-ip-postal-code") ??
    process.env.DEV_POSTAL_CODE ??
    "";
  if (postalCode) params.postalCode = postalCode;

  for (const [key, value] of searchParams.entries()) {
    if (key === "postalCode" || key === "degree") continue;
    params[key] = value;
  }

  const degrees = searchParams.getAll("degree");
  if (degrees.length) params.degree = degrees;

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("inquiries[")) params[key] = value;
  }

  const ctx: RequestContext = {
    query: params,
    headers: Object.fromEntries(request.headers.entries()),
    meta,
    session,
    fp,
  };

  const clickConfig = buildClickConfig(params);

  const maxSchools = searchParams.get("maxSchools");
  const maxPrograms = searchParams.get("maxPrograms");
  const truncateConfig = {
    ...(maxSchools ? { maxSchools: parseInt(maxSchools) } : {}),
    ...(maxPrograms ? { maxPrograms: parseInt(maxPrograms) } : {}),
  };

  // groups param: "linkouts,rfi|zeta,mm,eddy" — | separates groups, , separates providers within group
  // offerType is the legacy single-group override
  const groupsParam = searchParams.get("groups");
  const offerTypes = searchParams.getAll("offerType");
  let groups: string[][] | undefined;
  if (groupsParam) {
    groups = groupsParam.split("|").map((g) => g.split(",").map((s) => s.trim()).filter(Boolean));
  } else if (offerTypes.length) {
    groups = [offerTypes.map((t) => OFFER_TYPE_MAP[t] ?? t.toLowerCase())];
  }

  // providers limits which external APIs are called
  // when groups is specified, auto-derive from external providers mentioned in groups
  const providersParam = searchParams.get("providers");
  let activeProviders: Set<string> | null;
  if (providersParam) {
    activeProviders = new Set(providersParam.split(",").map((s) => s.trim()));
  } else if (groups) {
    activeProviders = new Set(groups.flat().filter((p) => EXTERNAL_PROVIDERS.has(p)));
  } else {
    activeProviders = null;
  }

  const raw = await fetchProviderResults(params, ctx, activeProviders);
  const { listings, message } = processListings(raw, session, clickConfig, groups, truncateConfig);

  const search = crypto.randomUUID();
  after(() => fireImpressions(listings, ctx, search));

  return Response.json({ listings, message });
}
