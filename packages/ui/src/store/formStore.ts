import { create } from "zustand";

const isTransient = (key: string) =>
  key === "consent" || key.startsWith("custom[");

export interface FormStore {
  //state
  formValues: Record<string, string>;
  savedValues: Record<string, string>;
  fieldErrors: Record<string, string>;
  //actions
  setFormValue: (key: string, value: string) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  saveFormValues: () => void;
  resetTransient: () => void;
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formValues: {},
  savedValues: {},
  fieldErrors: {},
  setFormValue: (key: string, value: string) =>
    set((state) => ({ formValues: { ...state.formValues, [key]: value } })),
  setFieldErrors: (errors: Record<string, string>) =>
    set(() => ({ fieldErrors: errors })),
  saveFormValues: () =>
    set((state) => ({
      savedValues: Object.fromEntries(
        Object.entries(state.formValues).filter(([key]) => !isTransient(key))
      ),
    })),
  resetTransient: () =>
    set((state) => ({
      formValues: { ...state.savedValues },
      fieldErrors: {},
    })),
  resetForm: () => set(() => ({ formValues: {}, savedValues: {}, fieldErrors: {} })),
}));
