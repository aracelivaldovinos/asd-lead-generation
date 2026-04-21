export type Band = "BAND1" | "BAND_COLLAB" | "BAND2" | "BAND3" | "BAND_BASIC";

export interface ListingsConfig {
  maxSchools?: number;
  maxPrograms?: number;
}

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
  disclaimer: string;
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

export interface RawRFISubmitResponse {
  valid: boolean;
  success: boolean;
  fieldErrors: Record<string, string>;
  formErrors: string[];
}


export interface RawFiltersResponse {
  filter: RawFilters;
  prefilter: RawPrefilter;
}

export interface RawFilters {
  settings: RawSettingsDegree[];
  degree: RawSettingsDegree[]
  subjectArea: RawSubjectArea
}

export interface RawSettingsDegree {
  value: string;
  displayName: string;
}

export interface RawSubjectArea extends RawFilterQuestion {
  specialization: RawSpecialization[]
}

export interface RawPrefilter {
  schema: {
    properties: Record<string, RawPrefilterSchemaProperty>;
  };
  options: {
    fields: Record<string, RawPrefilterFieldOption>;
  };
}

export interface RawFilterQuestion {
  value: string;
  displayName: string;
  description: string;
}
export type RawSpecialization = RawFilterQuestion;

export type RawPrefilterSchemaProperty = RawRFISchemaProperty;

export type RawPrefilterFieldOption = RawRFIFieldOption;

export interface FilterResponse {
  setting: FilterQuestion[];
  degree: FilterQuestion[];
  subjectArea: FilterQuestion[];
  specialization: FilterQuestion[];
  distance: FilterQuestion[];
}

export type FilterQuestion = RFIQuestion;
