import { type NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

const STRING_PARAMS = [
  "utm_medium",
  "utm_source",
  "subjectArea",
  "marketContext",
  "distance",
  "hsGraduation",
  "nursingLicense",
  "education",
  "firstName",
  "lastName",
  "emailAddress",
  "phoneNumber",
  "startDate",
  "universalLeadId",
  "pingEnabled",
  "setting",
  "resultSize",
  "maxSchools",
  "maxPrograms",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const metaValue = request.cookies.get("asd_s_meta")?.value ?? "";
  const { fp } = JSON.parse(metaValue);

  const postalCode =
    searchParams.get("postalCode") ??
    request.headers.get("x-vercel-ip-postal-code") ??
    "";

  const params = new URLSearchParams();
  if (postalCode) params.set("postalCode", postalCode);

  for (const key of STRING_PARAMS) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }

  // array params
  for (const value of searchParams.getAll("degree")) {
    params.append("degree", value);
  }
  for (const value of searchParams.getAll("offerType")) {
    params.append("offerType", value);
  }

  // inquiries is an object: inquiries[programId]=date
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("inquiries[")) {
      params.append(key, value);
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/v3/listings?${params}`, {
    headers: {
      "Cookie": `asd_s_meta=${metaValue}`,
      "x-asd-fp": fp,
    },
  });
  const data = await response.json();
  return Response.json(data);
}
