import { requireAuth, requireAdmin, redirectIfAuthed } from "./auth-loaders";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import UserDashboard from "./pages/user/UserDashboard";
import PublicAbout from "./pages/PublicAbout";
import LogoutButton from "./components/common/LogoutButton";
import PublicNotFound from "./pages/PublicNotFound";
import AdminNotFound from "./pages/admin/AdminNotFound";
import UserNotFound from "./pages/user/UserNotFound";
import PublicLayout from "./layouts/PublicLayout";

const routes = [
  {
    path: "/",
    element: <PublicLayout />,
    loader: redirectIfAuthed, // prevent logged-in users (especially admin)
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <PublicAbout /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <PublicNotFound /> },
    ],
  },
  // {
  //   // index: true,
  //   path: "/",
  //   element: <Home />,
  //   loader: redirectIfAuthed,
  //   errorElement: <PublicNotFound />,
  // },
  // {
  //   path: "/about",
  //   element: <PublicAbout />,
  //   loader: redirectIfAuthed,
  // },
  // {
  //   path: "/login",
  //   element: <Login />,
  //   loader: redirectIfAuthed,
  // },

  // 👑 Admin routes — all start with /admin
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: requireAdmin,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "logout", element: <LogoutButton /> },
      { path: "*", element: <AdminNotFound /> },
    ],
  },

  // 🙋 User routes
  {
    path: "/user",
    element: <UserLayout />,
    loader: requireAuth,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "logout", element: <LogoutButton /> },
      { path: "*", element: <UserNotFound /> },
    ],
  },
  { path: "*", element: <PublicNotFound /> },
];

export default routes;
