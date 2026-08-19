export const cleanProgramName = (name: string | undefined | null): string => {
  if (!name) return "";

  const parts = name.split(" - ");

  const cleanedPrefix = parts[0].replace(/\./g, "");
  const isPrefix = cleanedPrefix.length <= 6 && !cleanedPrefix.includes(" ");

  const programName = isPrefix && parts[1] ? parts[1] : parts[0];
  return programName.replace(/\s*\(.*?\)\s*$/, "").trim();
};
