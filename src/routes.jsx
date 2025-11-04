// routes.jsx
import {
  publicGate,
  redirectIfAuthedOnLogin,
  requireAdmin,
  requireUser,
} from "./auth-loaders";

import Home from "./pages/Home";

import PublicAbout from "./pages/PublicAbout";
import PublicNotFound from "./pages/PublicNotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminMedicines from "./pages/admin/AdminMedicines";
import AdminNotFound from "./pages/admin/AdminNotFound";

import UserOrders from "./pages/user/UserOrders";
import UserNotFound from "./pages/user/UserNotFound";

// (Optional) user-only pages live under /user/* but there is no generic /user dashboard
import AdminLayout from "./layouts/admin/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import PublicLayout from "./layouts/PublicLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminMedicineCategory from "./pages/admin/AdminMedicineCategory";
import AdminMedicineType from "./pages/admin/AdminMedicineType";
import AdminGeneric from "./pages/admin/AdminGeneric";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAddNewMedicine from "./pages/admin/AdminAddNewMedicine";

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
      { path: "companies", element: <AdminCompanies /> },
      { path: "medicine_categories", element: <AdminMedicineCategory /> },
      { path: "medicine", element: <AdminMedicines /> },
      { path: "medicine/add_new", element: <AdminAddNewMedicine /> },
      { path: "medicine_type", element: <AdminMedicineType /> },
      { path: "medicine_generic", element: <AdminGeneric /> },
      { path: "users", element: <AdminUsers /> },
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
      { path: "*", element: <UserNotFound /> },
    ],
  },

  // Fallback — public 404
  { path: "*", element: <PublicNotFound /> },
];

export default routes;
