import { Listing } from "@asd/domain";
import { cookies } from "next/headers";
import { getCachedFilters } from "@/app/lib/filters";
import { LISTING_PARAMS } from "@/app/lib/listing-params";
import ListingsClient from "@/app/components/ListingsClient";

interface ListingsSectionProps {
  params: Record<string, string | string[]>;
}

export default async function ListingsSection({ params }: ListingsSectionProps) {
  const cookieStore = await cookies();
  const metaValue = cookieStore.get("asd_s_meta")?.value ?? "";
  const { fp } = metaValue ? JSON.parse(metaValue) : { fp: "" };

  const query = new URLSearchParams();
  for (const key of LISTING_PARAMS) {
    if (key === "degree") continue;
    const value = params[key];
    if (value) query.set(key, Array.isArray(value) ? value[0] : value);
  }

  // degree as array
  const degrees = params["degree"];
  if (degrees) {
    for (const v of Array.isArray(degrees) ? degrees : [degrees]) {
      query.append("degree", v);
    }
  }

  // inquiries[programId]=date
  for (const [key, value] of Object.entries(params)) {
    if (key.startsWith("inquiries[")) {
      query.append(key, Array.isArray(value) ? value[0] : value);
    }
  }

  const [{ filters }, listingsResponse] = await Promise.all([
    getCachedFilters(params),
    fetch(`${process.env.API_BASE_URL}/api/v3/listings?${query}`, {
      headers: {
        "Cookie": `asd_s_meta=${metaValue}`,
        "x-asd-fp": fp,
      },
    }).then((r) => r.json()),
  ]);

  const listings: Listing[] = listingsResponse.listings;

  const initialValues = Object.fromEntries(
    LISTING_PARAMS
      .filter((key) => key in params)
      .map((key) => {
        const value = params[key];
        return [key, Array.isArray(value) ? value[0] : value];
      })
  );

  return (
    <ListingsClient
      listings={listings}
      filters={filters}
      initialValues={initialValues}
    />
  );
}
