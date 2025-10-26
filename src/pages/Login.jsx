import { useSetAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router";

export default function Login() {
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  function handleLogin(role) {
    // Set cookie
    document.cookie = `user_role=${role}; path=/; max-age=86400`;

    // Update Jotai (this triggers AuthWatcher)
    setAuth({
      initialized: true,
      loggedIn: true,
      role,
      name: role === "admin" ? "Admin Demo" : "User Demo",
    });

    // Small delay before redirect ensures Jotai update propagates
    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/user", { replace: true });
    }, 100);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Login</h2>
      <p>Select a role to simulate login:</p>
      <button onClick={() => handleLogin("user")}>Login as User</button>{" "}
      <button onClick={() => handleLogin("admin")}>Login as Admin</button>
    </div>
  );
}
