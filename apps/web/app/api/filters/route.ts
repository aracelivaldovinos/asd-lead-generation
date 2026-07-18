import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const metaCookie = request.cookies.get("asd_s_meta");
  const metaValue = metaCookie?.value ?? "";

  const { fp } = JSON.parse(metaValue);
  const upstreamHeaders = {
    "Cookie": `asd_s_meta=${metaValue}`,
    "x-asd-fp": fp,
  };

  const upstreamUrl = `${process.env.API_BASE_URL}/api/v3/filters?${params}`;
  const response = await fetch(upstreamUrl, { headers: upstreamHeaders });
  const data = await response.json();
  return Response.json(data);
}
