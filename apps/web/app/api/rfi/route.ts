import { type NextRequest } from "next/server";

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

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v3/rfi/${programId}?${params}`,
    {
      headers: {
        "Cookie": `asd_s_meta=${metaValue}`,
        "x-asd-fp": fp,
      },
    }
  );
  const data = await response.json();
  return Response.json(data);
}
