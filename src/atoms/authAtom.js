// authAtom.js
import { atom } from "jotai";

export const authAtom = atom({
  initialized: false, // first check done
  loggedIn: false,
  role: null, // "admin" | "user" | null
  name: null,
  cartItemCount: 0,
  cartItems: []
});
