import { type NextRequest } from "next/server";

type GeoData = {
  postalCode: string;
  city: string;
  state: string;
};

async function lookupByPostalCode(postalCode: string): Promise<GeoData> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${postalCode}`);
    if (!response.ok) return { postalCode, city: "", state: "" };
    const data = await response.json();
    const place = data.places?.[0];
    return {
      postalCode,
      city: place?.["place name"] ?? "",
      state: place?.["state abbreviation"] ?? "",
    };
  } catch {
    return { postalCode, city: "", state: "" };
  }
}

export async function GET(request: NextRequest) {
  const postalCode = request.nextUrl.searchParams.get("postalCode");

  if (postalCode) {
    const data = await lookupByPostalCode(postalCode);
    return Response.json(data);
  }

  const ipPostalCode = request.headers.get("x-vercel-ip-postal-code") ?? "";
  const city = request.headers.get("x-vercel-ip-city") ?? "";
  const state = request.headers.get("x-vercel-ip-country-region") ?? "";

  return Response.json({ postalCode: ipPostalCode, city, state });
}
