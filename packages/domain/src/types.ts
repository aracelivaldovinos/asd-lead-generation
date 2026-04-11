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

export interface RawRFISchemaProperty {
  title: string;
  type: string;
  required: boolean;
  maxLength: number;
  pattern?: string;
  enum?: string[];
}

export interface RawRFIFieldOption {
  type: string;
  optionLabels?: string[];
}

export interface RawRFIQuestions {
  schema: {
    properties: Record<string, RawRFISchemaProperty>;
  };
  options: {
    fields: Record<string, RawRFIFieldOption>;
  };
}

export interface RawRFIResponse {
  displayName: string;
  schoolName: string;
  schoolId: number;
  logo: Logo;
  useLeadId: boolean;
  useTrustedForm: boolean;
  tcpaDisclaimer: string;
  tcpaCheckboxRequired: boolean;
  disclaimer: string | null;
  privacyPolicy: string;
  questions: RawRFIQuestions;
}

export interface RFIOption {
  value: string;
  displayName: string;
}

export interface RFIQuestion {
  key: string;
  title: string;
  type: string;
  required: boolean;
  pattern: string | null;
  maxLength: number;
  options: RFIOption[] | null;
}

export interface RFIResponse {
  displayName: string;
  schoolName: string;
  schoolId: number;
  logo: Logo;
  useLeadId: boolean;
  useTrustedForm: boolean;
  tcpaDisclaimer: string;
  tcpaCheckboxRequired: boolean;
  questions: RFIQuestion[];
}
