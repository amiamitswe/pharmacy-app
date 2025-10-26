// layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router";
import AuthWatcher from "./AuthWatcher";


export default function AdminLayout() {
  return (
    <div style={{ padding: 20 }}>
      <AuthWatcher /> {/* ✅ now inside Router context */}
      <h2>👑 Admin Panel</h2>
      <nav>
        <Link to="/admin">Dashboard</Link> |{" "}
        <Link to="/admin/orders">Orders</Link> |{" "}
        <Link to="/admin/logout">Logout</Link>
      </nav>
      <Outlet />
    </div>
  );
}
