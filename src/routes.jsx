// routes.jsx
import {
  publicGate,
  redirectIfAuthedOnLogin,
  requireAdmin,
  requireUser,
} from "./auth-loaders";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import PublicAbout from "./pages/PublicAbout";
import LogoutButton from "./components/common/LogoutButton";
import PublicNotFound from "./pages/PublicNotFound";
import AdminNotFound from "./pages/admin/AdminNotFound";
import PublicLayout from "./layouts/PublicLayout";

// (Optional) user-only pages live under /user/* but there is no generic /user dashboard
import UserLayout from "./layouts/UserLayout";
import UserOrders from "./pages/user/UserOrders";
import UserNotFound from "./pages/user/UserNotFound";
import Signup from "./pages/Signup";

const routes = [
  // 🌐 Public site — admin is redirected away, users are allowed
  {
    path: "/",
    element: <PublicLayout />,
    loader: publicGate, // admin -> /admin, user or anon -> stay here
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <PublicAbout /> },

      // 🔐 Login page — if already authed, bounce them appropriately
      { path: "login", element: <Login />, loader: redirectIfAuthedOnLogin },
      { path: "signup", element: <Signup />, loader: redirectIfAuthedOnLogin },

      // 404 for public
      { path: "*", element: <PublicNotFound /> },
    ],
  },

  // 👑 Admin — only admins can access anything under /admin
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: requireAdmin,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "*", element: <AdminNotFound /> },
    ],
  },

  // 🙋 User-only pages (no generic /user landing). Add only the restricted pages you need.
  {
    path: "/user",
    element: <UserLayout />,
    loader: requireUser, // blocks anon and admins
    children: [
      { path: "orders", element: <UserOrders /> },
      { path: "logout", element: <LogoutButton /> },
      { path: "*", element: <UserNotFound /> },
    ],
  },

  // Fallback — public 404
  { path: "*", element: <PublicNotFound /> },
];

export default routes;
