// layouts/PublicLayout.jsx
import { Outlet, Link } from "react-router";

export default function PublicLayout() {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h2>🌐 Public Area</h2>
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main>
        <Outlet /> {/* 🔹 This renders the actual public page content */}
      </main>

      <footer style={{ marginTop: 30, borderTop: "1px solid #ddd", paddingTop: 10 }}>
        <small>© {new Date().getFullYear()} YourApp — Public Site</small>
      </footer>
    </div>
  );
}
