import { Listing, ListingsConfig, Program, RawProgram } from './types';
export * from './queue';
export * from './constants';
export * from './rfi';
export * from './filters';
export * from './types';
export * from './mocks';
export * from './urlParams';

const DEFAULT_CONFIG: ListingsConfig = {
  maxSchools: Infinity,
  maxPrograms: 3
}

export const transformListings = (
  listings: Listing[],
  config: ListingsConfig = {}
): Listing[] =>
  listings
    .map((listing) => ({
      ...listing,
      schools: listing.schools.slice(0, config.maxSchools).map((school) => ({
        ...school,
        locations: school.locations.map((location) => ({
          ...location,
          programs: location.programs.slice(0, config.maxPrograms).map((program) => ({
            ...program,
            displayName: cleanProgramName(program.displayName),
          })),
        })),
      })),
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

export const cleanProgramName = (name: string | undefined | null): string => {
  if (!name) return "";

  const parts = name.split(" - ");

  const cleanedPrefix = parts[0].replace(/\./g, "");
  const isPrefix = cleanedPrefix.length <= 6 && !cleanedPrefix.includes(" ");

  const programName = isPrefix && parts[1] ? parts[1] : parts[0];
  return programName.replace(/\s*\(.*?\)\s*$/, "").trim();
};
