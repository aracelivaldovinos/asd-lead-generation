import { unstable_cache } from "next/cache";
import { fetchFilters } from "@asd/services";

export const getCachedFilters = unstable_cache(
  () =>
    fetchFilters(
      `${process.env.API_BASE_URL}/api/v3/filters?s=${process.env.SESSION_TOKEN}&marketContext=${process.env.MARKET_CONTEXT}`
    ),
  ["filters"],
  { revalidate: false }
);
