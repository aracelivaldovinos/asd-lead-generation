import { type NextRequest } from "next/server";
import { fetchZippopotam } from "@/app/lib/zippopotam";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const programId = searchParams.get("programId");

  if (!programId) {
    return Response.json({ error: "programId is required" }, { status: 400 });
  }

  const metaValue = request.cookies.get("asd_s_meta")?.value ?? "";
  const { fp } = JSON.parse(metaValue);

  const params = new URLSearchParams(searchParams);
  params.delete("programId");

  const geoPostalCode = request.headers.get("x-vercel-ip-postal-code") ?? process.env.DEV_POSTAL_CODE ?? "";
  const geoCity = request.headers.get("x-vercel-ip-city") ?? process.env.DEV_CITY ?? "";
  const geoState = request.headers.get("x-vercel-ip-country-region") ?? process.env.DEV_STATE ?? "";

  const paramPostalCode = searchParams.get("postalCode") ?? "";
  const paramCity = searchParams.get("city") ?? "";
  const paramState = searchParams.get("state") ?? "";

  // If user supplied a postal code but not city/state, look them up from zippopotam
  const needsLookup = paramPostalCode && (!paramCity || !paramState);

  const [response, zipGeo] = await Promise.all([
    fetch(`${process.env.API_BASE_URL}/api/v3/rfi/${programId}?${params}`, {
      headers: {
        "Cookie": `asd_s_meta=${metaValue}`,
        "x-asd-fp": fp,
      },
    }),
    needsLookup ? fetchZippopotam(paramPostalCode) : Promise.resolve(null),
  ]);

  const data = await response.json();

  const postalCode = paramPostalCode || geoPostalCode;
  const city = paramCity || zipGeo?.city || geoCity;
  const state = paramState || zipGeo?.state || geoState;

  return Response.json({ ...data, defaultValues: { postalCode, city, state } });
}
