import { Listing, ListingsConfig, Program, RawProgram, ThankYouLinkout } from './types';
export * from './queue';
export * from './constants';
export * from './rfi';
export * from './filters';
export * from './types';
export * from './mocks';
export * from './urlParams';
export { cleanProgramName } from './cleanProgramName';

export const extractThankYouLinkouts = (listings: Listing[]): ThankYouLinkout[] =>
  listings
    .filter((l) => l.showOnThankYou)
    .flatMap((listing) =>
      listing.schools.flatMap((school) =>
        school.locations.flatMap((location) =>
          location.programs
            .filter((p) => !!p.clickTrackingUrl)
            .map((p) => ({
              programId: p.programId,
              displayName: p.displayName,
              programInfo: p.programInfo,
              clickTrackingUrl: p.clickTrackingUrl!,
              school: { displayName: school.displayName, logo: school.logo },
            }))
        )
      )
    );

const DEFAULT_CONFIG: ListingsConfig = {
  maxSchools: Infinity,
}

export const transformListings = (
  listings: Listing[],
  config: ListingsConfig = {}
): Listing[] =>
  listings
    .map((listing) => ({
      ...listing,
      schools: listing.schools.slice(0, config.maxSchools).map((school) => {
        const maxP = config.maxPrograms ?? Infinity;
        let remaining = maxP;
        return {
          ...school,
          locations: school.locations.map((location) => ({
            ...location,
            programs: location.programs.slice(0, remaining).map((program) => {
              remaining--;
              return { ...program, rawDisplayName: program.rawDisplayName ?? program.displayName, displayName: cleanProgramName(program.displayName) };
            }),
          })).filter((l) => l.programs.length > 0),
        };
      }),
    }))
    .filter((listing) => listing.schools.some((s) => s.locations.some((l) => l.programs.length > 0)));

export const groupPrograms = (
  listings: Listing[],
  config = DEFAULT_CONFIG
): { rfis: Program[]; linkouts: Program[] } => {
  const allPrograms = transformListings(listings, config).flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) =>
        location.programs.map((program: RawProgram) => ({
          ...program,
          rawDisplayName: program.rawDisplayName ?? program.displayName,
          name: listing.name,
          instructionMethod: location.instructionMethod,
          school: { id: school.id, displayName: school.displayName },
        })),
      ),
    ),
  );

  return {
    rfis: allPrograms.filter((p) => !p.clickTrackingUrl),
    linkouts: allPrograms.filter((p) => !!p.clickTrackingUrl),
  };
};

import { cleanProgramName } from './cleanProgramName';
