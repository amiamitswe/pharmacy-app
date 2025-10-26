export default function AdminNotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>🚫 404 – Admin Page Not Found</h1>
      <p>The page you are trying to access doesn’t exist in the admin panel.</p>
      <a href="/admin">Go back to Admin Dashboard</a>
    </div>
  );
}
