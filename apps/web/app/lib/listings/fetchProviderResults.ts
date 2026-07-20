import { LISTING_PARAMS } from "@/app/lib/listing-params";
import { buildURL } from "./buildURL";
import { createProviders } from "./providers";
import type { RequestContext } from "./types";

export type ProviderRawResults = {
  webui: unknown;
  mm: unknown;
  eddy: unknown;
};

export const fetchProviderResults = async (
  params: Record<string, string | string[]>,
  ctx: RequestContext,
): Promise<ProviderRawResults> => {
  const providers = createProviders({ webUiHost: process.env.API_BASE_URL! });

  const query = new URLSearchParams();
  for (const key of LISTING_PARAMS) {
    if (key === "degree") continue;
    const value = params[key];
    if (value) query.set(key, Array.isArray(value) ? value[0] : value);
  }
  const degrees = params["degree"];
  if (degrees) {
    for (const v of Array.isArray(degrees) ? degrees : [degrees])
      query.append("degree", v);
  }
  for (const [key, value] of Object.entries(params)) {
    if (key.startsWith("inquiries["))
      query.append(key, Array.isArray(value) ? value[0] : value);
  }

  const wuiHeaders = {
    Cookie: `asd_s_meta=${JSON.stringify(ctx.meta)}`,
    "x-asd-fp": ctx.fp,
  };

  const eddyUrl = buildURL(providers.eddy, ctx);

  const [webui, mm, eddy] = await Promise.all([
    fetch(`${process.env.API_BASE_URL}/api/v3/listings?${query}`, {
      headers: wuiHeaders,
    })
      .then((r) => r.ok ? r.json() : { listings: [] })
      .catch(() => ({ listings: [] })),
    fetch(buildURL(providers.mm, ctx).toString())
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null),
    fetch(`${providers.eddy.host}${providers.eddy.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(eddyUrl.searchParams)),
    })
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null),
  ]);

  return { webui, mm, eddy };
};
