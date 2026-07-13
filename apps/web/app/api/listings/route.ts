import { type NextRequest } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

const STRING_PARAMS = [
  "postalCode",
  "subjectArea",
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

  const params = new URLSearchParams({
    s: process.env.SESSION_TOKEN!,
    marketContext: process.env.MARKET_CONTEXT!,
  });

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

  const response = await fetch(`${API_BASE_URL}/api/v3/listings?${params}`);
  const data = await response.json();
  return Response.json(data);
}
