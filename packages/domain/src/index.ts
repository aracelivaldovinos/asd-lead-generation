import { Listing, Program, RawProgram } from './types';
export * from './queue';
export * from './types';

export const groupPrograms = (
  listings: Listing[],
): { rfis: Program[]; linkouts: Program[] } => {
  const allPrograms = listings.flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) =>
        location.programs.map((program: RawProgram) => {
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
