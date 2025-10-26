// layouts/UserLayout.jsx
import { Outlet, Link } from "react-router";
import AuthWatcher from "./AuthWatcher";

export default function UserLayout() {
  return (
    <div style={{ padding: 20 }}>
      <AuthWatcher /> {/* ✅ safe placement */}
      <h2>🙋 User Dashboard</h2>
      <nav>
        <Link to="/user">Dashboard</Link> |{" "}
        <Link to="/user/logout">Logout</Link>
      </nav>
      <Outlet />
    </div>
  );
}
