import { describe, it, expect } from "vitest";
import { Program } from "../types";
import { canAddToQeueu } from "../qeueu";

describe('canAddToQeueu', () => {
const program: Program = {
        programId: "1",
        displayName: "Business",
        degreeName: "Bachelor",
        clickTrackingUrl: "",
        instructionMethod: "campus",
        programInfo: 'programInfo',
        school: {
            id: 123,
            displayName: "School"
        }
    };

    it('returns false when school has been submitted', () => {
        const addToQueue = canAddToQeueu(program, [123]);

        expect(addToQueue).toBe(false); 
    });
    it('returns true when school has been submitted', () => {
        const program2 = {...program, school: {...program.school, id:456}}
        const addToQueue = canAddToQeueu(program2, [123, 987]);

        expect(addToQueue).toBe(true); 
    });
});