import { atom } from "jotai";

export const mCategoryAtom = atom({
  categories: [],
  loading: false,
  error: null,
  count: 0,
});
