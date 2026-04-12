import { create } from "zustand";

export interface FormStore {
  //state
  formValues: Record<string, string>;
  fieldErrors: Record<string, string>;
  //actions
  setFormValue: (key: string, value: string) => void;
  setFieldErrors: (errors: Record<string, string>) => void;

}

export const useFormStore = create<FormStore>((set) => ({
  formValues: {},
  fieldErrors: {},
  setFormValue: (key: string, value: string) =>
    set((state) => ({ formValues: { ...state.formValues, [key]: value } })),
  setFieldErrors: (errors: Record<string, string>) => 
    set(() => ({fieldErrors: errors}))
}));
