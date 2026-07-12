import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const programId = searchParams.get("programId");

  if (!programId) {
    return Response.json({ error: "programId is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    s: process.env.SESSION_TOKEN!,
    marketContext: process.env.MARKET_CONTEXT!,
  });

  const response = await fetch(`${process.env.API_BASE_URL}/api/v3/rfi/${programId}?${params}`);
  const data = await response.json();
  return Response.json(data);
}
