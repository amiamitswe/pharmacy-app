import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { Button } from "@heroui/react";
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function LogoutButton() {
  const setAuth = useSetAtom(authAtom);

  function handleLogout() {
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setAuth({
      initialized: true,
      loggedIn: false,
      role: null,
      name: null,
    });
  }

  return (
    <Button variant="solid" color="primary" radius="sm" onPress={handleLogout}>
      <RiLogoutCircleRLine className="h-5 w-5" /> Logout
    </Button>
  );
}
