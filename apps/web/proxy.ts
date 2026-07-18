import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const COOKIE_NAME = "asd_s_meta";
const THIRTY_MINUTES = 1800;

const CSP = [
  "default-src 'self' https://*.leadid.com https://*.trustedform.com https://*.cloudfront.net https://www.google-analytics.com",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "script-src-elem 'self' https: 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "style-src-attr 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self' https://api.zippopotam.us https://*.leadid.com http://*.leadid.com https://*.trustedform.com https://*.cloudfront.net https://www.google-analytics.com",
  "frame-src https://*.cloudfront.net http://*.cloudfront.net https://*.lidstatic.com",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export async function proxy(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_NAME);

  if (existing?.value) {
    try {
      JSON.parse(existing.value); // validate
      const response = NextResponse.next();
      response.headers.append("Set-Cookie", `${COOKIE_NAME}=${existing.value}; Path=/; Max-Age=${THIRTY_MINUTES}`);
      response.headers.set("Content-Security-Policy", CSP);
      return response;
    } catch {
      // fall through to create a new session
    }
  }

  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "0.0.0.0";

  const fingerprint = Buffer.from(userAgent + ip, "utf8").toString("base64");
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(fingerprint)
  );
  const fp = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || request.nextUrl.host;
  const protocol = request.nextUrl.protocol;
  const landing_url = isApiRoute
    ? (referer || `${protocol}//${host}`)
    : `${protocol}//${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const meta = {
    session: uuid(),
    landing_url,
    dom_current: request.nextUrl.origin,
    dom_referer: referer,
    fp,
  };

  const cookieValue = JSON.stringify(meta);
  const existingCookies = request.headers.get("cookie") || "";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("cookie", existingCookies ? `${existingCookies}; ${COOKIE_NAME}=${cookieValue}` : `${COOKIE_NAME}=${cookieValue}`);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.append("Set-Cookie", `${COOKIE_NAME}=${cookieValue}; Path=/; Max-Age=${THIRTY_MINUTES}`);
  response.headers.set("Content-Security-Policy", CSP);
  return response;
}
