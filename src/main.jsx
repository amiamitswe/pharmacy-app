import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes";
import AuthGate from "./layouts/AuthGate";

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider placement="top-center" />
        <AuthGate>
          <RouterProvider router={router} />
        </AuthGate>
      </NextThemesProvider>
    </HeroUIProvider>
  </StrictMode>
);
