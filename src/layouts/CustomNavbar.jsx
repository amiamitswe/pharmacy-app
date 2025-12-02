import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { ThemeSwitcher } from "../components/common/ThemeSwitcher";
import { Link, NavLink, useNavigate } from "react-router";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import LogoutButton from "../components/common/LogoutButton";
import { FaCartPlus, FaUser } from "react-icons/fa";
import { userLinks } from "../routePaths";

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

  console.log(user);

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
      <p className="text-large">
        Hello{" "}
        <span className="font-bold dark:text-white text-black">
          "{user?.name}"
        </span>
      </p>
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <Link to="/">
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </Link>
      </NavbarContent> */}

      <NavbarContent className="hidden sm:flex" justify="end">
        {!user?.loggedIn ? (
          <>
            <ThemeSwitcher />
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
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  aria-label="User menu"
                  color="primary"
                  variant="bordered"
                  radius="full"
                  className="border-default-200 border-1"
                >
                  <Avatar src={user?.avatar} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  onPress={() => navigation("/user/profile")}
                >
                  Profile
                </DropdownItem>
                <DropdownItem key="theme" className="p-0">
                  <div className="flex items-center justify-between w-full px-2 py-1">
                    <span>Theme</span>
                    <ThemeSwitcher />
                  </div>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="p-0">
                  <LogoutButton className="w-full text-left" />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <Badge color="danger" content={user?.cartItemCount} shape="circle">
          <Button
            isIconOnly
            aria-label="Cart item"
            color="primary"
            variant="bordered"
            radius="full"
            size="sm"
            className="border-default-200 border-1"
            onPress={() => navigation("/user/shopping-cart")}
          >
            <FaCartPlus size={16} />
          </Button>
        </Badge>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="cursor-pointer"
        />
      </NavbarContent>

      <NavbarMenu className="flex items-center gap-4 justify-between pb-6 pt-0">
        <div className="w-full">
          <p className="text-large">
            Hello{" "}
            <span className="font-bold dark:text-white text-black">
              "{user?.name}"
            </span>
          </p>
          <ul className="flex flex-col gap-2 mt-4">
            {userLinks?.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "pending"
                      : isActive
                      ? "bg-teal-400 text-white h-10 flex items-center justify-start px-4 rounded-md text-lg font-medium"
                      : "text-lg text-gray-500 dark:text-gray-300 hover:bg-teal-500 hover:text-white h-10 flex items-center justify-start px-4 rounded-md"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-6 w-full">
          <div className="flex-1 w-full">
            <LogoutButton className="w-full" />
          </div>
          <ThemeSwitcher />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
