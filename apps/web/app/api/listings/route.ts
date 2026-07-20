import { type NextRequest, after } from "next/server";
import { fetchProviderResults } from "@/app/lib/listings/fetchProviderResults";
import { processListings } from "@/app/lib/listings/processListings";
import { parseMetaCookie, buildClickConfig } from "@/app/lib/listings/context";
import { fireImpressions } from "@/app/lib/listings/fireImpressions";
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
    if (key === "postalCode" || key === "degree" || key === "offerType") continue;
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

  // offerType drives which provider groups to use
  const offerTypes = searchParams.getAll("offerType");
  const groups = offerTypes.length
    ? [offerTypes.map((t) => OFFER_TYPE_MAP[t] ?? t.toLowerCase())]
    : undefined;

  const maxSchools = searchParams.get("maxSchools");
  const maxPrograms = searchParams.get("maxPrograms");
  const truncateConfig = {
    ...(maxSchools ? { maxSchools: parseInt(maxSchools) } : {}),
    ...(maxPrograms ? { maxPrograms: parseInt(maxPrograms) } : {}),
  };

  const raw = await fetchProviderResults(params, ctx);
  const { listings, message } = processListings(raw, session, clickConfig, groups, truncateConfig);

  const search = crypto.randomUUID();
  after(() => fireImpressions(listings, ctx, search));

  return Response.json({ listings, message });
}
