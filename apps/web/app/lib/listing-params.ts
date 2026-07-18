export const LISTING_PARAMS = [
  "postalCode",
  "subjectArea",
  "degree",
  "marketContext",
  "distance",
  "hsGraduation",
  "nursingLicense",
  "education",
  "firstName",
  "lastName",
  "emailAddress",
  "phoneNumber",
  "startDate",
  "universalLeadId",
  "pingEnabled",
  "setting",
  "resultSize",
  "utm_medium",
  "utm_source",
] as const;

export type ListingParam = (typeof LISTING_PARAMS)[number];
