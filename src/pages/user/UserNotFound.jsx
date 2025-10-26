export default function UserNotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>⚠️ 404 – User Page Not Found</h1>
      <p>This page doesn’t exist or you don’t have permission to view it.</p>
      <a href="/user">Go back to Dashboard</a>
    </div>
  );
}
