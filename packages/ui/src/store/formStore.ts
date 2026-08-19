import { create } from "zustand";

const isTransient = (key: string) =>
  key === "consent" || key.startsWith("custom[");

const GEO_KEYS = new Set(["postalCode", "city", "state"]);

export interface FormStore {
  //state
  formValues: Record<string, string>;
  savedValues: Record<string, string>;
  fieldErrors: Record<string, string>;
  dirtyFields: Record<string, boolean>;
  //actions
  setFormValue: (key: string, value: string) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  setFieldError: (key: string, message: string) => void;
  clearFieldError: (key: string) => void;
  saveFormValues: () => void;
  resetTransient: () => void;
  seedFromParams: (params: Record<string, string>) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formValues: {},
  savedValues: {},
  fieldErrors: {},
  dirtyFields: {},
  setFormValue: (key: string, value: string) =>
    set((state) => ({ formValues: { ...state.formValues, [key]: value }, dirtyFields: { ...state.dirtyFields, [key]: true } })),
  setFieldErrors: (errors: Record<string, string>) =>
    set(() => ({ fieldErrors: errors })),
  setFieldError: (key: string, message: string) =>
    set((state) => ({ fieldErrors: { ...state.fieldErrors, [key]: message } })),
  clearFieldError: (key: string) =>
    set((state) => {
      const { [key]: _, ...rest } = state.fieldErrors;
      return { fieldErrors: rest };
    }),
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
      dirtyFields: {},
    })),
  seedFromParams: (params: Record<string, string>) =>
    set((state) => {
      const seeded: Record<string, string> = {};
      const geoOverrides: Record<string, string> = {};
      for (const [key, value] of Object.entries(params)) {
        if (!value) continue;
        const formKey = key === "phoneNumber" ? "primaryPhone" : key;
        if (GEO_KEYS.has(formKey)) {
          geoOverrides[formKey] = value;
        } else if (!state.savedValues[formKey]) {
          seeded[formKey] = value;
        }
      }
      return { formValues: { ...seeded, ...state.formValues, ...geoOverrides } };
    }),
  resetForm: () => set(() => ({ formValues: {}, savedValues: {}, fieldErrors: {}, dirtyFields: {} })),
}));
