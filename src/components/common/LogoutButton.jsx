import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";


export default function LogoutButton() {
  const setAuth = useSetAtom(authAtom);

  function handleLogout() {
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setAuth({
      initialized: true,
      loggedIn: false,
      role: null,
      name: null,
    });
  }

  return <button onClick={handleLogout}>🚪 Logout</button>;
}
