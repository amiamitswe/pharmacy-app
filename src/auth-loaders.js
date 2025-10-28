// auth-loaders.js
// ✅ Use react-router for redirect in v6+
import { redirect } from "react-router";
import { getDefaultStore } from "jotai";
import { authAtom } from "./atoms/authAtom";

// ---- Fake one-time "server" fetch
async function fetchUserFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cookie = document.cookie
        .split("; ")
        .find((r) => r.startsWith("user_role="));
      if (!cookie) return resolve(null);
      const role = cookie.split("=")[1];
      resolve({
        name: role === "admin" ? "Admin Demo" : "User Demo",
        role,
        loggedIn: true,
      });
    }, 1000);
  });
}

async function getUser() {
  const store = getDefaultStore();
  const auth = store.get(authAtom);

  // Run the "API" call only once
  if (!auth?.initialized) {
    const user = await fetchUserFromServer();
    if (user) {
      store.set(authAtom, { ...user, initialized: true });
      return user;
    }
    store.set(authAtom, {
      initialized: true,
      loggedIn: false,
      role: null,
      name: null,
    });
    return null;
  }

  return auth?.loggedIn ? auth : null;
}

// Helpers
const isAdmin = (u) => u?.role === "admin";
const isUser = (u) => u?.role === "user";

// 🔓 Public gate: allow anon + user; push admin to /admin
export async function publicGate() {
  const user = await getUser();
  if (isAdmin(user)) throw redirect("/admin");
  return null; // user or anon can see public pages
}

// 🔐 Login page guard: if already authed, send them away
export async function redirectIfAuthedOnLogin({ request }) {
  const user = await getUser();
  if (!user) return null;

  // honor ?next= for users; admins always go /admin
  const url = new URL(request.url);
  const next = url.searchParams.get("next");

  if (isAdmin(user)) throw redirect("/admin");
  if (isUser(user)) throw redirect(next || "/"); // users stay on public site by default
  return null;
}

// 👑 Require admin for /admin/*
export async function requireAdmin() {
  const user = await getUser();
  if (!user) throw redirect("/login?next=/admin");
  if (!isAdmin(user)) throw redirect("/"); // non-admins back to public
  return user;
}

// 🙋 Require user for /user/* (blocks anon and admins)
export async function requireUser({ request }) {
  const user = await getUser();
  const url = new URL(request.url);

  if (!user)
    throw redirect(
      `/login?next=${encodeURIComponent(url.pathname + url.search)}`
    );
  if (!isUser(user)) {
    // Admins should not access user-only routes
    throw redirect("/admin");
  }
  return user;
}
