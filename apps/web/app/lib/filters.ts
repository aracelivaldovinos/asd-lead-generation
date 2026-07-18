import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { fetchFilters } from "@asd/services";

const API_BASE_URL = process.env.API_BASE_URL ?? "";

export const getCachedFilters = async (params: Record<string, string | string[]> = {}) => {
  const cookieStore = await cookies();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else query.set(key, value);
  }
  const metaValue = cookieStore.get("asd_s_meta")?.value ?? "";
  const { session, fp } = metaValue ? JSON.parse(metaValue) : { session: "", fp: "" };
  const cacheKey = [query.toString(), session].join("|");

  return unstable_cache(
    () => fetchFilters(`${API_BASE_URL}/api/v3/filters?${query}`, {
      headers: {
        "Cookie": `asd_s_meta=${metaValue}`,
        "x-asd-fp": fp,
      },
    }),
    ["filters", cacheKey],
    { revalidate: false }
  )();
};
