import { atom } from "jotai";

export const medicineGenericAtom = atom({
  generics: [],
  loading: false,
  error: null,
  count: 0,
});
