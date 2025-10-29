import { atom } from "jotai";

export const medicineAtom = atom({
  companies: [],
  loading: false,
  error: null,
  count: 0,
});
