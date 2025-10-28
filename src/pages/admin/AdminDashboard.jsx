import { useEffect } from "react";
import userService from "../../api-services/userService";
import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const data = await userService.profile();

      if (data.status === 200) {
        setAuth({
          initialized: true,
          loggedIn: true,
          role: data.data.user.role,
          name: data.data.user.name,
        });
      } else {
        setAuth({
          initialized: true,
          loggedIn: false,
          role: null,
          name: null,
        });
        navigate("/login");
      }
    };

    getUserData();
  }, []);
  return (
    <div>
      <h3>📊 Admin Dashboard</h3>
      <p>Welcome, Admin!</p>
    </div>
  );
}
