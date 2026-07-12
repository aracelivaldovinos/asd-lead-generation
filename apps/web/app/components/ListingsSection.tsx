import { Listing } from "@asd/domain";
import { getCachedFilters } from "@/app/lib/filters";
import ListingsClient from "@/app/components/ListingsClient";

export const LISTING_PARAMS = [
  "postalCode",
  "subjectArea",
  "degree",
  "distance",
  "hsGraduation",
  "nursingLicense",
  "education",
  "setting",
  "resultSize",
] as const;

interface ListingsSectionProps {
  params: Record<string, string>;
}

export default async function ListingsSection({ params }: ListingsSectionProps) {
  const query = new URLSearchParams({
    s: process.env.SESSION_TOKEN!,
    marketContext: process.env.MARKET_CONTEXT!,
  });

  for (const key of LISTING_PARAMS) {
    if (params[key]) query.set(key, params[key]);
  }

  const [{ filters }, listingsResponse] = await Promise.all([
    getCachedFilters(),
    fetch(`${process.env.API_BASE_URL}/api/v3/listings?${query}`).then((r) => r.json()),
  ]);

  const listings: Listing[] = listingsResponse.listings;

  const initialValues = Object.fromEntries(
    LISTING_PARAMS.filter((key) => key in params).map((key) => [key, params[key]])
  );

  return (
    <ListingsClient
      listings={listings}
      filters={filters}
      initialValues={initialValues}
    />
  );
}
