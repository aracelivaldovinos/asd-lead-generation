import type { ClickConfig } from "./clickURL";

export const parseMetaCookie = (metaValue: string) => {
  const meta = metaValue ? JSON.parse(metaValue) : {};
  const { session = "", fp = "" } = meta;
  return { meta, session, fp };
};

export const buildClickConfig = (params: Record<string, string | string[]> = {}): ClickConfig => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const v of value) searchParams.append(key, v);
    } else {
      searchParams.set(key, value);
    }
  }
  return {
    searchParams,
    redirectServer: process.env.REDIRECT_SERVER ?? "",
    appEnv: process.env.APP_ENV ?? "development",
    mockUrl: process.env.MOCK_CLICK_URL ?? "",
  };
};
