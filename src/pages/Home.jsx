import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <h1>🏠 Public Home Page</h1>
      <p>Anyone can see this page (except admins after login)</p>
      <Link to="/about">About</Link> | <Link to="/login">Login</Link>
    </div>
  );
}
