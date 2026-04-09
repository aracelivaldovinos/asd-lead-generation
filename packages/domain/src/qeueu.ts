import { Program } from "./types";

export const canAddToQeueu = (program: Program, submittedSchoolIds: number[]): boolean => {
    const schoolId = program.school.id; 

    return !submittedSchoolIds.includes(schoolId);
}