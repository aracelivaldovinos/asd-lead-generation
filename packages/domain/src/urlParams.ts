export const isCallCenter = (params: URLSearchParams):boolean => {
  const utmMedium = params.get("utm_medium")?.toLowerCase() ?? "";
  return utmMedium?.includes("cc");
}