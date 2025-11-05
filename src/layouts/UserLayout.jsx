// layouts/UserLayout.jsx
import { Outlet, Link } from "react-router";
import AuthWatcher from "./AuthWatcher";
import CustomNavbar from "../components/layout/CustomNavbar";

export default function UserLayout() {
  return (
    <>
      <AuthWatcher /> {/* ✅ safe placement */}
      <CustomNavbar />
      <h2>🙋 User Dashboard</h2>
      <nav>
        <Link to="/user">Dashboard</Link> |{" "}
        <Link to="/user/orders">Orders</Link> |{" "}
        <Link to="/user/logout">Logout</Link>
      </nav>
      <Outlet />
    </>
  );
}
