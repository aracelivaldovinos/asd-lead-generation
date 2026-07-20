import { Listing } from "@asd/domain";

type ClickURLConfig = {
  providerId: string;
  band: string;
  searchParams: URLSearchParams;
  redirectServer: string;
  appEnv: string;
  clickThroughEnvs: string[];
  mockUrl: string;
};

export type ClickConfig = {
  searchParams: URLSearchParams;
  redirectServer: string;
  appEnv: string;
  mockUrl: string;
};

export const buildClickURL = (rawUrl: string, config: ClickURLConfig): string => {
  if (!rawUrl || config.providerId === "rfi") return "";
  const useRealUrl = config.clickThroughEnvs.includes(config.appEnv);
  if (config.providerId === "linkouts") {
    const effectiveUrl = useRealUrl ? rawUrl : config.mockUrl;
    if (!effectiveUrl) return rawUrl;
    const clickUrl = new URL(effectiveUrl);
    config.searchParams.forEach((value, key) => {
      if (!clickUrl.searchParams.has(key)) clickUrl.searchParams.set(key, value);
    });
    clickUrl.searchParams.set("band", config.band);
    if (!config.redirectServer) return clickUrl.toString();
    const redirectUrl = new URL(config.redirectServer);
    redirectUrl.searchParams.set("asd-r-url", clickUrl.toString());
    redirectUrl.searchParams.set("provider-id", "linkouts");
    return redirectUrl.toString();
  }
  // mm/eddy/zeta: pass through if useRealUrl, otherwise mock
  return useRealUrl ? rawUrl : (config.mockUrl || rawUrl);
};

export const applyClickURLs = (
  listings: Listing[],
  config: ClickConfig & { providerId: string; clickThroughEnvs: string[] },
): Listing[] =>
  listings.map((listing) => ({
    ...listing,
    schools: listing.schools.map((school) => ({
      ...school,
      locations: school.locations.map((location) => ({
        ...location,
        programs: location.programs.map((program) => ({
          ...program,
          clickTrackingUrl: program.clickTrackingUrl
            ? buildClickURL(program.clickTrackingUrl, { ...config, band: listing.name })
            : program.clickTrackingUrl,
        })),
      })),
    })),
  }));
