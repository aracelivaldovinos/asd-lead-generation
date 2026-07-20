import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { getCachedFilters } from "@/app/lib/filters";
import { LISTING_PARAMS } from "@/app/lib/listing-params";
import ListingsClient from "@/app/components/ListingsClient";
import { fetchProviderResults } from "@/app/lib/listings/fetchProviderResults";
import { processListings } from "@/app/lib/listings/processListings";
import { parseMetaCookie, buildClickConfig } from "@/app/lib/listings/context";
import { fireImpressions } from "@/app/lib/listings/fireImpressions";
import type { RequestContext } from "@/app/lib/listings/types";

interface ListingsSectionProps {
  params: Record<string, string | string[]>;
}

export default async function ListingsSection({ params }: ListingsSectionProps) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  const metaValue = cookieStore.get("asd_s_meta")?.value ?? "";
  const { meta, session, fp } = parseMetaCookie(metaValue);
  const clickConfig = buildClickConfig(params);

  const ctx: RequestContext = {
    query: params,
    headers: Object.fromEntries(headerStore.entries()),
    meta,
    session,
    fp,
  };

  const [{ filters }, raw] = await Promise.all([
    getCachedFilters(params),
    fetchProviderResults(params, ctx),
  ]);

  const { listings, isFallback } = processListings(raw, session, clickConfig);

  const search = crypto.randomUUID();
  after(() => fireImpressions(listings, ctx, search));

  const initialValues = Object.fromEntries(
    LISTING_PARAMS
      .filter((key) => key in params)
      .map((key) => {
        const value = params[key];
        if (key === "degree") return [key, Array.isArray(value) ? value : [value]];
        return [key, Array.isArray(value) ? value[0] : value];
      })
  );

  return (
    <ListingsClient
      listings={listings}
      filters={filters}
      initialValues={initialValues}
      isFallback={isFallback}
    />
  );
}
