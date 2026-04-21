import { Listing, ListingsConfig, Program, RawProgram } from './types';
export * from './queue';
export * from './rfi';
export * from './types';
export * from './mocks';
export * from './urlParams';

const DEFAULT_CONFIG: ListingsConfig = {
  maxSchools: Infinity,
  maxPrograms: 3
}

export const groupPrograms = (
  listings: Listing[],
  config = DEFAULT_CONFIG
): { rfis: Program[]; linkouts: Program[] } => {
  const allPrograms = listings.flatMap((listing) =>
    listing.schools.slice(0, config.maxSchools).flatMap((school) =>
      school.locations.flatMap((location) =>
        location.programs.slice(0, config.maxPrograms).map((program: RawProgram) => {
          return {
            ...program,
            name: listing.name,
            displayName: cleanProgramName(program.displayName),
            instructionMethod: location.instructionMethod,
            school: {id: school.id, displayName: school.displayName}
          };
        }),
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
