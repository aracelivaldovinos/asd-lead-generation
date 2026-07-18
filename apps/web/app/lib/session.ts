import { cookies } from "next/headers";

const COOKIE_NAME = "asd_s_meta";

export type SessionMeta = {
  session: string;
  landing_url: string;
  dom_current: string;
  dom_referer: string;
  fp: string;
};

export async function getSessionMeta(): Promise<SessionMeta | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionMeta;
  } catch {
    return null;
  }
}
