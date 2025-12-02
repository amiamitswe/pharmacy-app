import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { addToast, Button } from "@heroui/react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import userService from "../../api-services/userService";

export default function LogoutButton({ className }) {
  const setAuth = useSetAtom(authAtom);

  async function handleLogout() {
    const res = await userService.logout();

    localStorage.removeItem("accessToken");

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
    <Button
      variant="solid"
      color="primary"
      radius="sm"
      onPress={handleLogout}
      className={className}
    >
      <RiLogoutCircleRLine className="h-5 w-5" /> Logout
    </Button>
  );
}
