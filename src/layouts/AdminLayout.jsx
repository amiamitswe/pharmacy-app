import { Outlet } from "react-router";
import AuthWatcher from "./AuthWatcher";
import Footer from "../components/layout/Footer";
import AdminLinks from "./admin/AdminLinks";
import { Link } from "react-router";
import { AcmeLogo } from "../components/layout/CustomNavbar";
import AdminHeader from "./admin/AdminHeader";

export default function AdminLayout() {
  return (
    <>
      <AuthWatcher />
      <div className="grid grid-cols-12">
        <div className="hidden overflow-visible relative z-10 lg:block lg:col-span-2 bg-slate-100 dark:bg-slate-900 min-h-screen border-r-1.5 border-slate-200 dark:border-slate-800">
          <div className="p-4">
            <Link to="/admin" className="flex items-center gap-2 text-lg">
              <AcmeLogo /> Admin Panel
            </Link>
            <AdminLinks />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-10 xl:col-span-8">
          <AdminHeader />

          <main className="min-h-[calc(100vh-112px)] flex flex-col justify-between p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
