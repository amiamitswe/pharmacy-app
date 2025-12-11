import React, { useCallback, useMemo } from "react";
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
import { FaCartPlus } from "react-icons/fa";
import { userLinks } from "../routePaths";

// Constants
const NAVBAR_CLASSES = {
  content: "w-full",
  wrapper: "max-w-full",
};

const BUTTON_BASE_CLASSES = "border-default-200 border-1";

const NAV_LINK_CLASSES = {
  base: "h-10 flex items-center justify-start px-4 rounded-md text-lg",
  active: "bg-teal-400 text-white font-medium",
  inactive: "text-gray-500 dark:text-gray-300 hover:bg-teal-500 hover:text-white",
};

// Components
export const AcmeLogo = React.memo(() => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
));

const NavbarBrandLink = React.memo(({ className = "" }) => (
  <Link to="/" className={className}>
    <NavbarBrand>
      <AcmeLogo />
      <p className="font-bold text-inherit">ACME</p>
    </NavbarBrand>
  </Link>
));

const UserGreeting = React.memo(({ userName, className = "" }) => (
  <p className={`text-large ${className}`}>
    Hello{" "}
    <span className="font-bold dark:text-white text-black">"{userName}"</span>
  </p>
));

const CartButton = React.memo(({ cartItemCount, onPress, size = 20, buttonSize }) => (
  <Badge color="danger" content={cartItemCount} shape="circle">
    <Button
      isIconOnly
      aria-label="Cart item"
      color="primary"
      variant="bordered"
      radius="full"
      size={buttonSize}
      className={BUTTON_BASE_CLASSES}
      onPress={onPress}
    >
      <FaCartPlus size={size} />
    </Button>
  </Badge>
));

const AuthLinks = React.memo(() => (
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
));

const UserDropdown = React.memo(({ user, onNavigate }) => (
  <Dropdown placement="bottom-end">
    <DropdownTrigger>
      <Button
        isIconOnly
        aria-label="User menu"
        color="primary"
        variant="bordered"
        radius="full"
        className={BUTTON_BASE_CLASSES}
      >
        <Avatar src={user?.avatar} />
      </Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="User Actions" variant="flat">
      <DropdownItem key="profile" onPress={() => onNavigate("/user/profile")}>
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
));

const MobileMenu = React.memo(({ user, onMenuClose }) => {
  const getNavLinkClassName = useCallback(
    ({ isActive, isPending }) => {
      if (isPending) return "pending";
      return `${NAV_LINK_CLASSES.base} ${
        isActive ? NAV_LINK_CLASSES.active : NAV_LINK_CLASSES.inactive
      }`;
    },
    []
  );

  return (
    <NavbarMenu className="flex items-center gap-4 justify-between pb-6 pt-0">
      <div className="w-full">
        <UserGreeting userName={user?.name} />
        <ul className="flex flex-col gap-2 mt-4">
          {userLinks?.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.to}
                onClick={onMenuClose}
                className={getNavLinkClassName}
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
  );
});

export default function CustomNavbar() {
  const navigate = useNavigate();
  const [user] = useAtom(authAtom);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isLoggedIn = user?.loggedIn;
  const handleCartClick = useCallback(
    () => navigate("/user/shopping-cart"),
    [navigate]
  );
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), []);

  const navbarBrand = useMemo(
    () => <NavbarBrandLink />,
    []
  );

  const userGreeting = useMemo(
    () => <UserGreeting userName={user?.name} className="hidden sm:block" />,
    [user?.name]
  );

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={NAVBAR_CLASSES}
    >
      <NavbarContent className="pr-3" justify="start">
        {isLoggedIn ? (
          <>
            {userGreeting}
            <NavbarBrandLink className="sm:hidden" />
          </>
        ) : (
          navbarBrand
        )}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        {isLoggedIn ? (
          <>
            <CartButton
              cartItemCount={user?.cartItemCount}
              onPress={handleCartClick}
            />
            <UserDropdown user={user} onNavigate={navigate} />
          </>
        ) : (
          <AuthLinks />
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        {isLoggedIn ? (
          <>
            <CartButton
              cartItemCount={user?.cartItemCount}
              onPress={handleCartClick}
              size={16}
              buttonSize="sm"
            />
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="cursor-pointer"
            />
          </>
        ) : (
          <AuthLinks />
        )}
      </NavbarContent>

      {isLoggedIn && (
        <MobileMenu user={user} onMenuClose={handleMenuClose} />
      )}
    </Navbar>
  );
}
