import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAtomValue } from "jotai";
import { authAtom } from "../atoms/authAtom";

export default function AuthWatcher() {
  const auth = useAtomValue(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.initialized) return; // wait until auth is loaded

    // 🧭 Public routes list
    const isPublic =
      location.pathname === "/" ||
      location.pathname === "/about" ||
      location.pathname === "/login";

    // 🔒 If not logged in and not on public page → go to /login
    if (!auth.loggedIn && !isPublic) {
      navigate("/login", { replace: true });
      return;
    }

    // 👑 Admin rules
    if (auth.loggedIn && auth.role === "admin") {
      if (!location.pathname.startsWith("/admin")) {
        navigate("/admin", { replace: true });
      }
      return;
    }

    // 🙋 User rules
    if (auth.loggedIn && auth.role === "user") {
      if (location.pathname === "/login" || location.pathname.startsWith("/admin")) {
        navigate("/user", { replace: true });
      }
      return;
    }
  }, [auth, location.pathname, navigate]);

  return null;
}
