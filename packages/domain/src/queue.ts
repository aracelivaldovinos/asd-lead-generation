import { Program } from "./types";

export const canAddToQueue = (program: Program, submittedSchoolIds: (number | string)[]): boolean => {
    const schoolId = program.school.id; 

    return !submittedSchoolIds.includes(schoolId);
}