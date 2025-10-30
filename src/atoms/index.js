import { atom } from "jotai";

export const usersAtom = atom({
  users: [],
  loading: false,
  error: null,
  count: 0,
});
