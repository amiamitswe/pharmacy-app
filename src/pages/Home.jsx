import { useAtom } from "jotai";
import { Link } from "react-router";
import { authAtom } from "../atoms/authAtom";

export default function Home() {
  const [user] = useAtom(authAtom);
  return (
    <div>
      <h1>🏠 Public Home Page</h1>
      <p>Anyone can see this page (except admins after login)</p>
      <Link to="/about">About</Link>{" "}
      {!user?.loggedIn && <Link to="/login">| Login</Link>}
    </div>
  );
}
