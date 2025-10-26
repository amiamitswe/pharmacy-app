"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {/* <Button isDisabled>Loading...</Button>
        <Button isDisabled>Loading...</Button> */}
        <Button isDisabled>Loading...</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <p>The current theme is: {resolvedTheme} - {theme}</p> */}
      <div className="flex gap-2">
        <Button onPress={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark" : "Light"} Mode</Button>
        {/* <Button onPress={() => setTheme("light")}>Light Mode</Button>
        <Button onPress={() => setTheme("dark")}>Dark Mode</Button>
        <Button onPress={() => setTheme("system")}>System</Button> */}
      </div>
    </div>
  );
}
