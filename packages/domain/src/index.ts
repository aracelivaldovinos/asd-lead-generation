export type Band = "BAND1" | "BAND_COLLAB" | "BAND2" | "BAND3" | "BAND_BASIC";

export interface Listing {
  name: string;
  message: string;
  schools: School[];
}

export interface School {
  id: number;
  displayName: string;
  logo: Logo;
  locations: Location[];
}

export interface Logo {
  url: string;
  width: number;
  height: number;
}

export interface Location {
  instructionMethod: string;
  programs: RawProgram[];
}

export interface RawProgram {
  programId: string;
  displayName: string;
  degreeName: string;
  clickTrackingUrl?: string;
}

export interface Program extends RawProgram {
    instructionMethod: string;
}

export const groupPrograms = (
  listings: Listing[],
): { rfis: Program[]; linkouts: Program[] } => {
  const allPrograms = listings.flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) =>
        location.programs.map((program: RawProgram) => {
          return { ...program, displayName: cleanProgramName(program.displayName), instructionMethod: location.instructionMethod };
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
}
