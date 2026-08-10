import { NextRequest, NextResponse } from "next/server";

async function validateEmail(email: string): Promise<{ valid: boolean }> {
  const res = await fetch("https://neutrinoapi.net/email-validate", {
    method: "POST",
    headers: {
      "user-id": process.env.NEUTRINO_API_USER_ID!,
      "api-key": process.env.NEUTRINO_API_EMAIL_VALIDATION_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, "fix-typos": true }),
  });
  if (!res.ok) return { valid: true }; // fail open
  const data = await res.json();
  return { valid: !!data.valid };
}

async function validatePhone(phone: string): Promise<{ valid: boolean }> {
  const digits = phone.replace(/\D/g, "");
  const url = new URL(process.env.REAL_TIME_PHONE_URL!);
  url.searchParams.set("phone", digits);
  url.searchParams.set("token", process.env.REAL_TIME_PHONE_TOKEN!);
  url.searchParams.set("output", "json");
  const res = await fetch(url);
  if (!res.ok) return { valid: true }; // fail open
  const data = await res.json();
  return { valid: typeof data.status === "string" && data.status.includes("connected") };
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ fieldErrors: {} });
  }

  try {
    const { emailAddress, primaryPhone } = await request.json();
    const fieldErrors: Record<string, string> = {};

    await Promise.all([
      emailAddress
        ? validateEmail(emailAddress).then(({ valid }) => {
            if (!valid) fieldErrors.emailAddress = "Please enter a valid email";
          })
        : Promise.resolve(),
      primaryPhone
        ? validatePhone(primaryPhone).then(({ valid }) => {
            if (!valid) fieldErrors.primaryPhone = "Please enter a valid phone";
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ fieldErrors });
  } catch {
    return NextResponse.json({ fieldErrors: {} }); // fail open
  }
}
