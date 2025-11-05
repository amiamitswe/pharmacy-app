import { redirect } from "react-router";
import { getDefaultStore } from "jotai";
import { authAtom } from "./atoms/authAtom";
import userService from "./api-services/userService";
import { addToast } from "@heroui/react";

async function fetchUserFromServer() {
  if (!localStorage.getItem("accessToken")) return null;

  const response = await userService.profile();
  if (response.status === 200) {
    
    return {
      name: response.data.user.name,
      role: response.data.user.role,
      loggedIn: true,
      cartItemCount: response.data.user.cartItemCount || 0,
      cartItems: response.data.cartItems || [],
    };
  } else {
    return null;
  }
}

async function getUser() {
  try {
    const store = getDefaultStore();
    const auth = store.get(authAtom);

    // Run the "API" call only once
    if (!auth?.initialized) {
      const user = await fetchUserFromServer();

      if (user) {
        store.set(authAtom, {
          ...user,
          initialized: true,
        });
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
  } catch (error) {
    addToast({
      title: error.data.message,
      color: "danger",
    });
    if (error.status === 403) {
      localStorage.removeItem("accessToken");

      throw redirect("/login");
    }
  }
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
