import { atom } from "jotai";

export const medicineFormAtom = atom({
  medicineForms: [],
  loading: false,
  error: null,
  count: 0,
});


