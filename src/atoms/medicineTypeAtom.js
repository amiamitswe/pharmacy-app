import { atom } from "jotai";

export const medicineTypeAtom = atom({
  medicineTypes: [],
  loading: false,
  error: null,
  count: 0,
});


