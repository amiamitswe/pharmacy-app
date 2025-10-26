// auth-loaders.js
import { redirect } from "react-router";
import { getDefaultStore } from "jotai";
import { authAtom } from "./atoms/authAtom";

// 🧠 fake user check (runs only once)
async function fetchUserFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cookie = document.cookie.split("; ").find((r) => r.startsWith("user_role="));
      if (!cookie) return resolve(null);

      const role = cookie.split("=")[1];
      const user = {
        name: role === "admin" ? "Admin Demo" : "User Demo",
        role,
        loggedIn: true,
      };
      console.log("Fetched user:", user);
      resolve(user);
    }, 1000);
  });
}

async function getUser() {
  const store = getDefaultStore();
  const auth = store.get(authAtom);

  // ✅ only run API check once, when initialized = false
  if (!auth.initialized) {
    const user = await fetchUserFromServer();
    if (user) {
      store.set(authAtom, { ...user, initialized: true });
      return user;
    } else {
      store.set(authAtom, { initialized: true, loggedIn: false, role: null, name: null });
      return null;
    }
  }

  // ✅ already initialized, use cached state
  return auth.loggedIn ? auth : null;
}

// 🔹 Require user (normal)
export async function requireAuth() {
  const user = await getUser();
  if (!user) throw redirect("/login");
  if (user.role === "admin") throw redirect("/admin");
  return user;
}

// 🔹 Require admin
export async function requireAdmin() {
  const user = await getUser();
  if (!user) throw redirect("/login");
  if (user.role !== "admin") throw redirect("/");
  return user;
}

// 🔹 Redirect if already authed (public routes)
export async function redirectIfAuthed() {
  const user = await getUser();
  if (!user) return null;
  if (user.role === "admin") throw redirect("/admin");
  if (user.role === "user") throw redirect("/user");
  return null;
}
