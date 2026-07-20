import { Listing, transformListings } from "@asd/domain";

export const filterListings = (
  listings: Listing[],
  filter: { programIds?: string[]; organizationIds?: string[] },
): Listing[] => {
  const { programIds, organizationIds } = filter;
  if (!programIds?.length && !organizationIds?.length) return listings;

  const orgSet = organizationIds?.length ? new Set(organizationIds) : null;
  const programSet = programIds?.length ? new Set(programIds) : null;

  return listings
    .map((listing) => ({
      ...listing,
      schools: listing.schools
        .filter((school) => !orgSet || orgSet.has(String(school.id)))
        .map((school) => ({
          ...school,
          locations: school.locations
            .map((loc) => ({
              ...loc,
              programs: programSet
                ? loc.programs.filter((p) => programSet.has(p.programId))
                : loc.programs,
            }))
            .filter((loc) => loc.programs.length > 0),
        }))
        .filter((school) => school.locations.length > 0),
    }))
    .filter((listing) => listing.schools.length > 0);
};

export const splitWebUIListings = (
  listings: Listing[],
): { rfi: Listing[]; linkouts: Listing[] } => ({
  rfi: listings.filter((l) =>
    l.schools.every((s) =>
      s.locations.every((loc) => loc.programs.every((p) => !p.clickTrackingUrl)),
    ),
  ),
  linkouts: listings.filter((l) =>
    l.schools.some((s) =>
      s.locations.some((loc) => loc.programs.some((p) => !!p.clickTrackingUrl)),
    ),
  ),
});

export const resolveListingGroups = (
  providerResults: Record<string, Listing[]>,
  groups: string[][],
  config: { minResults?: number; maxSchools?: number; maxPrograms?: number } = {},
): { listings: Listing[]; groupIndex: number } => {
  const { minResults = 1, ...truncateConfig } = config;

  for (let i = 0; i < groups.length; i++) {
    const combined = groups[i].flatMap((id) => providerResults[id] ?? []);
    const schoolCount = combined.reduce((n, l) => n + l.schools.length, 0);
    if (schoolCount >= minResults)
      return { listings: transformListings(combined, truncateConfig), groupIndex: i };
  }

  const lastGroupIndex = groups.length - 1;
  const lastGroup = groups[lastGroupIndex] ?? [];
  return {
    listings: transformListings(lastGroup.flatMap((id) => providerResults[id] ?? []), truncateConfig),
    groupIndex: lastGroupIndex,
  };
};
