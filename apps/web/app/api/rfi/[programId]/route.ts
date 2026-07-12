import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  const { programId } = await params;
  const body = await request.json();

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v3/rfi/${programId}?s=${process.env.SESSION_TOKEN}&marketContext=${process.env.MARKET_CONTEXT}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return Response.json(data);
}
