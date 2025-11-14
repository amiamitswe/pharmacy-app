import { ThemeSwitcher } from "../../components/common/ThemeSwitcher";
import LogoutButton from "../../components/common/LogoutButton";
import { useAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { Link } from "react-router";
import { AcmeLogo } from "../CustomNavbar";
import AdminMenuDrawer from "./AdminMenuDrawer";

function AdminHeader() {
  const [user] = useAtom(authAtom);

  return (
    <>
      <header className="bg-slate-100 dark:bg-slate-900 h-14 p-4 flex justify-between items-center border-b border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex lg:hidden items-center gap-2 text-lg">
            <AcmeLogo />
          </Link>
          <h1 className="text-large">
            Hello <span className="font-bold dark:text-white text-black">"{user.name}"</span>
          </h1>
        </div>
        <div>
          <div className="lg:flex hidden items-center gap-2">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
          <AdminMenuDrawer />
        </div>
      </header>
    </>
  );
}

export default AdminHeader;
