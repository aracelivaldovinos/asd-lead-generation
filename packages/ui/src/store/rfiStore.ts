import { create } from "zustand";
import { Program, canAddToQueue } from "@asd/domain";

export interface RFIStore {
  // state
  queue: Program[];
  allPrograms: Program[];
  submittedSchoolIds: (number | string)[];
  currentProgram: Program | null;
  // actions
  addToQueue: (program: Program) => void;
  initQueue: (programs: Program[]) => void;
  initPrograms: (programs: Program[]) => void;
  setCurrentProgram: (program: Program) => void;
  skipCurrent: () => void;
  submitCurrent: () => void;
  removeFromQueue: (programId: string) => void;
}

export const selectSchoolPrograms = (state: RFIStore) =>
  state.allPrograms.filter(
    (p) =>
      p.school.id === state.currentProgram?.school.id &&
      (p.name === "BAND1" || p.name === "BAND_COLLAB"),
  );

export const useRFIStore = create<RFIStore>((set) => ({
  queue: [],
  allPrograms: [],
  submittedSchoolIds: [],
  currentProgram: null,
  initPrograms: (programs: Program[]) => set(() => ({ allPrograms: programs })),
  addToQueue: (program: Program) =>
    set((state: RFIStore) => {
      if (!canAddToQueue(program, state.submittedSchoolIds)) return state;
      return { queue: [...state.queue, program] };
    }),
  initQueue: (programs: Program[]) =>
    set(() => ({ queue: programs, currentProgram: programs[0] })),
  setCurrentProgram: (program: Program) =>
    set((state: RFIStore) => {
      const filtered = state.queue.filter(
        (item) => item.programId !== program.programId,
      );
      return { currentProgram: program, queue: [program, ...filtered] };
    }),
  skipCurrent: () =>
    set((state: RFIStore) => {
      const filteredQueue = state.queue.filter(
        (program: Program) =>
          state.currentProgram?.programId !== program.programId,
      );
      return {
        queue: filteredQueue,
        currentProgram: filteredQueue[0] ?? null,
      };
    }),
  submitCurrent: () =>
    set((state: RFIStore) => {
      const current: Program | null = state.currentProgram;
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
