import { headers } from "next/headers";

export type GeoData = {
  postalCode: string;
  city: string;
  state: string;
};

export async function getGeoData(): Promise<GeoData> {
  const headersList = await headers();
  return {
    postalCode: headersList.get("x-vercel-ip-postal-code") ?? process.env.DEV_POSTAL_CODE ?? "",
    city: headersList.get("x-vercel-ip-city") ?? process.env.DEV_CITY ?? "",
    state: headersList.get("x-vercel-ip-country-region") ?? process.env.DEV_STATE ?? "",
  };
}
