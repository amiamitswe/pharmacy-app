import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { addToast, Button } from "@heroui/react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import userService from "../../api-services/userService";

export default function LogoutButton() {
  const setAuth = useSetAtom(authAtom);

  async function handleLogout() {
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    localStorage.removeItem("accessToken");

    const res = await userService.logout();
    if (res.status === 200) {
      setAuth({
        initialized: true,
        loggedIn: false,
        role: null,
        name: null,
      });
      addToast({
        title: "Logout successful!",
        color: "success",
      });
    }
  }

  return (
    <Button variant="solid" color="primary" radius="sm" onPress={handleLogout}>
      <RiLogoutCircleRLine className="h-5 w-5" /> Logout
    </Button>
  );
}
