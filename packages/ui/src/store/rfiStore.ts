import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Program, canAddToQueue, PERDOCEO_SCHOOL_IDS } from "@asd/domain";
import { useFormStore } from "./formStore";

const getSessionKey = (): string => {
  if (typeof document === "undefined") return "rfi_state";
  try {
    const cookie = document.cookie.split("; ").find((r) => r.startsWith("asd_s_meta="));
    const raw = cookie?.split("=").slice(1).join("=");
    if (raw) {
      const { session } = JSON.parse(decodeURIComponent(raw));
      if (session) return `rfi_state_${session}`;
    }
  } catch {}
  return "rfi_state";
};

export const MAX_RFIS = 7;

export interface RFIStore {
  // state
  queue: Program[];
  allPrograms: Program[];
  submittedPrograms: Program[];
  submittedSchoolIds: (number | string)[];
  skippedSchoolIds: (number | string)[];
  currentProgram: Program | null;
  inquiries: Record<string, string>;
  isSuggestedMode: boolean;
  // actions
  addToQueue: (program: Program) => void;
  initQueue: (programs: Program[]) => void;
  initSuggestedQueue: (programs: Program[]) => void;
  initPrograms: (programs: Program[]) => void;
  setCurrentProgram: (program: Program) => void;
  skipCurrent: () => void;
  addSkippedSchool: (schoolId: number | string) => void;
  submitCurrent: () => void;
  removeFromQueue: (programId: string) => void;
  syncQueue: (validSchoolIds: Set<number | string>) => void;
  clearQueue: () => void;
}

export const selectSchoolProgramsById = (schoolId: number) => (state: RFIStore) =>
  state.allPrograms.filter(
    (p) => p.school.id === schoolId && (p.name === "BAND1" || p.name === "BAND_COLLAB"),
  );

export const selectSubmittedPrograms = (state: RFIStore) => state.submittedPrograms;

export const useRFIStore = create<RFIStore>()(
  persist(
    (set) => ({
  queue: [],
  allPrograms: [],
  submittedPrograms: [],
  submittedSchoolIds: [],
  skippedSchoolIds: [],
  currentProgram: null,
  inquiries: {},
  isSuggestedMode: false,
  initPrograms: (programs: Program[]) => set(() => ({ allPrograms: programs })),
  addToQueue: (program: Program) =>
    set((state: RFIStore) => {
      if (!canAddToQueue(program, state.submittedSchoolIds)) return state;
      return { queue: [...state.queue, program], isSuggestedMode: false };
    }),
  initQueue: (programs: Program[]) =>
    set(() => ({ queue: programs, currentProgram: programs[0], isSuggestedMode: false })),
  initSuggestedQueue: (programs: Program[]) => {
    const deduped = programs.filter(
      (p, i, arr) => arr.findIndex((q) => q.school.id === p.school.id) === i,
    );
    set(() => ({ queue: deduped, currentProgram: deduped[0], isSuggestedMode: true }));
  },
  setCurrentProgram: (program: Program) =>
    set((state: RFIStore) => {
      const filtered = state.queue.filter(
        (item) => item.school.id !== program.school.id,
      );
      return { currentProgram: program, queue: [program, ...filtered] };
    }),
  skipCurrent: () =>
    set((state: RFIStore) => {
      const filteredQueue = state.queue.filter(
        (program: Program) => program.programId !== state.currentProgram?.programId,
      );
      return {
        queue: filteredQueue,
        currentProgram: filteredQueue[0] ?? null,
      };
    }),
  addSkippedSchool: (schoolId: number | string) =>
    set((state: RFIStore) => ({
      skippedSchoolIds: [...state.skippedSchoolIds, schoolId],
    })),
  submitCurrent: () =>
    set((state: RFIStore) => {
      const current: Program | null = state.currentProgram;
      if (!current) return state;

      const { formValues } = useFormStore.getState();

      if (!PERDOCEO_SCHOOL_IDS.includes(current.school.id as number)) {
        useFormStore.getState().saveFormValues();
      }

      const updatedSubmittedSchoolIds = [...state.submittedSchoolIds, current.school.id];
      const remainingQueue = state.queue.filter(
        (program: Program) => program.school.id !== current.school.id,
      );

      const newInquiries = { ...state.inquiries, [current.programId]: new Date().toISOString() };

      if (typeof document !== "undefined") {
        document.cookie = `asd_inquiries=${encodeURIComponent(JSON.stringify(newInquiries))}; Path=/; Max-Age=1800`;

        const PREPING_KEYS = ["firstName", "lastName", "emailAddress", "address", "city", "state", "postalCode", "education", "startDate", "universalLeadid"] as const;
        const prepingData: Record<string, string> = {};
        for (const key of PREPING_KEYS) {
          if (formValues[key]) prepingData[key] = formValues[key];
        }
        const phone = formValues["primaryPhone"] || formValues["phoneNumber"];
        if (phone) prepingData["phoneNumber"] = phone;
        prepingData["pingEnabled"] = "true";
        document.cookie = `asd_preping=${encodeURIComponent(JSON.stringify(prepingData))}; Path=/; Max-Age=1800`;
      }

      return {
        queue: remainingQueue,
        submittedPrograms: [...state.submittedPrograms, current],
        submittedSchoolIds: updatedSubmittedSchoolIds,
        currentProgram: remainingQueue[0] ?? null,
        inquiries: newInquiries,
      };
    }),
  removeFromQueue: (programId: string) =>
    set((state: RFIStore) => {
      const filterQueue = state.queue.filter(
        (program: Program) => program.programId !== programId,
      );
      return { queue: filterQueue };
    }),
  syncQueue: (validSchoolIds: Set<number | string>) =>
    set((state: RFIStore) => {
      const filteredQueue = state.queue.filter((p) => validSchoolIds.has(p.school.id));
      const currentStillValid = state.currentProgram && validSchoolIds.has(state.currentProgram.school.id);
      return {
        queue: filteredQueue,
        currentProgram: currentStillValid ? state.currentProgram : filteredQueue[0] ?? null,
      };
    }),
  clearQueue: () =>
    set(() => ({
      queue: [],
      currentProgram: null,
      isSuggestedMode: false,
      skippedSchoolIds: [],
    })),
    }),
    {
      name: getSessionKey(),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        submittedSchoolIds: state.submittedSchoolIds,
        inquiries: state.inquiries,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || typeof document === "undefined") return;
        if (Object.keys(state.inquiries).length > 0) {
          document.cookie = `asd_inquiries=${encodeURIComponent(JSON.stringify(state.inquiries))}; Path=/; Max-Age=1800`;
        }
      },
    }
  )
);
