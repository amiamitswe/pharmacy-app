import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
} from "@heroui/react";
import { ThemeSwitcher } from "../components/common/ThemeSwitcher";
import { Link, useNavigate } from "react-router";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import LogoutButton from "../components/common/LogoutButton";
import { FaCartPlus, FaUser } from "react-icons/fa";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function CustomNavbar() {
  const navigation = useNavigate();
  const [user] = useAtom(authAtom);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // console.log({user});
  

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        content: "w-full",
        wrapper: "max-w-full",
      }}
    >
      <NavbarContent className="sm:hidden pr-3" justify="start">
        <Link to="/">
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <Link to="/">
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        <ThemeSwitcher />
        {!user?.loggedIn ? (
          <>
            <NavbarItem>
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="warning" to="/signup" variant="flat">
                Sign Up
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <Button
              isIconOnly
              aria-label="Cart item"
              color="primary"
              variant="bordered"
              radius="full"
              className="border-default-200 border-1"
              onPress={() => navigation("/user")}
            >
              <FaUser size={20} />
            </Button>
            <Badge color="danger" content={user?.cartItemCount} shape="circle">
              <Button
                isIconOnly
                aria-label="Cart item"
                color="primary"
                variant="bordered"
                radius="full"
                className="border-default-200 border-1"
                onPress={() => navigation("/user/shopping-cart")}
              >
                <FaCartPlus size={20} />
              </Button>
            </Badge>
            <LogoutButton />
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="cursor-pointer"
        />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              to={item === "Log Out" ? "/login" : "/"}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
