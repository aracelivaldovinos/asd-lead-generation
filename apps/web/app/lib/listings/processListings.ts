import { Listing } from "@asd/domain";
import { mapResponse, mapZeta } from "./mapResponse";
import { applyClickURLs, type ClickConfig } from "./clickURL";
import { splitWebUIListings, resolveListingGroups } from "./filter";
import { PROVIDER_CLICK_ENVS } from "./providers";
import { NO_RESULTS_MESSAGE, FALLBACK_MESSAGE } from "./messages";
import type { ProviderRawResults } from "./fetchProviderResults";

const DEFAULT_GROUPS = [["linkouts", "rfi"], ["zeta", "mm", "eddy"]];

export type ProcessListingsResult = { listings: Listing[]; message?: string };

export const processListings = (
  raw: ProviderRawResults,
  session: string,
  clickConfig: ClickConfig,
  groups: string[][] = DEFAULT_GROUPS,
  truncateConfig: { maxSchools?: number; maxPrograms?: number } = {},
): ProcessListingsResult => {
  const clickCfg = (providerId: string) => ({
    ...clickConfig,
    providerId,
    clickThroughEnvs: PROVIDER_CLICK_ENVS[providerId] ?? [],
  });

  const { rfi, linkouts } = splitWebUIListings(
    (raw.webui as { listings?: Listing[] })?.listings ?? [],
  );

  const providerResults: Record<string, Listing[]> = {
    rfi,
    linkouts: applyClickURLs(linkouts, clickCfg("linkouts")),
    mm: raw.mm ? applyClickURLs(mapResponse(raw.mm, "mm"), clickCfg("mm")) : [],
    eddy: raw.eddy ? applyClickURLs(mapResponse(raw.eddy, "eddy"), clickCfg("eddy")) : [],
    zeta: applyClickURLs(mapZeta(session), clickCfg("zeta")),
  };

  const { listings, groupIndex } = resolveListingGroups(providerResults, groups, { maxSchools: 20, ...truncateConfig });
  const message = listings.length === 0 ? NO_RESULTS_MESSAGE : groupIndex > 0 ? FALLBACK_MESSAGE : undefined;
  return { listings, message };
};
