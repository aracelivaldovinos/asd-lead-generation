import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  const { programId } = await params;
  const metaValue = request.cookies.get("asd_s_meta")?.value ?? "";
  const { fp } = JSON.parse(metaValue);

  const body = await request.json();
  const upstreamParams = new URLSearchParams(request.nextUrl.searchParams);

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v3/rfi/${programId}?${upstreamParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `asd_s_meta=${metaValue}`,
        "x-asd-fp": fp,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return Response.json(data);
}
