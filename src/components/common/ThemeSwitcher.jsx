"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <Button isDisabled>Loading...</Button>
      </div>
    );
  }

  return (
    <Button
      isIconOnly
      aria-label="Change Theme"
      color="primary"
      variant="bordered"
      radius="full"
      className="border-default-200 border-1"
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <HiOutlineSun className="h-6 w-6" />
      ) : (
        <HiOutlineMoon className="h-6 w-6" />
      )}
    </Button>
  );
}

{
  /* <Button onPress={() => setTheme("system")}>System</Button> */
}
