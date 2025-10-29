import { atom } from "jotai";

export const companyAtom = atom({
  companies: [],
  loading: false,
  error: null,
  count: 0,
});
