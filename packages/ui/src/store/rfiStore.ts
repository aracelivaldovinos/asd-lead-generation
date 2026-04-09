import { create } from "zustand";
import { Program, canAddToQueue } from "@asd/domain";

export interface RFIStore {
  // state
  queue: Program[];
  submittedSchoolIds: number[];
  currentProgram: Program | null;
  // actions
  addToQueue: (program: Program) => void;
  submitCurrent: () => void;
  removeFromQueue: (programId: string) => void;
}

export const useRFIStore = create<RFIStore>((set) => ({
  queue: [],
  submittedSchoolIds: [],
  currentProgram: null,
  addToQueue: (program: Program) =>
    set((state: RFIStore) => {
      if (!canAddToQueue(program, state.submittedSchoolIds)) return state;
      return { queue: [...state.queue, program] };
    }),
  submitCurrent: () =>
    set((state: RFIStore) => {
      const current: Program = state.queue[0];
      if (!current) return state;

      return {
        queue: state.queue.filter(
          (program: Program) => program.programId !== current.programId,
        ),
        submittedSchoolIds: [...state.submittedSchoolIds, current.school.id],
        currentProgram: state.queue[1] ?? null,
      };
    }),

  removeFromQueue: (programId: string) =>
    set((state: RFIStore) => {
      const filterQueue = state.queue.filter(
        (program: Program) => program.programId !== programId,
      );
      return { queue: filterQueue };
    }),
}));
