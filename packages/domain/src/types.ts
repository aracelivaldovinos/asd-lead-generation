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
  src: string;
  width: number;
  height: number;
}

export interface Location {
  instructionMethod: string;
  programs: RawProgram[];
}

export interface RawProgram {
  displayName: string;
  degreeName: string;
  clickTrackingUrl?: string;
  programId: string;
  programInfo: string;
}

export interface Program extends RawProgram {
  name: string;
  school: Omit<School, "locations" | "logo">;
  instructionMethod: string;
}
