import { type NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const s = searchParams.get("s");
  const marketContext = searchParams.get("marketContext");

  if (!s || !marketContext) {
    return Response.json(
      { error: "s and marketContext are required" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ s, marketContext });
  const response = await fetch(`${API_BASE_URL}/api/v3/filters?${params}`);

  const data = await response.json();
  return Response.json(data);
}
