import { Outlet, Link } from "react-router";

import AdminLinks from "./AdminLinks";
import AdminHeader from "./AdminHeader";
import AuthWatcher from "../AuthWatcher";
import Footer from "../Footer";
import { AcmeLogo } from "../CustomNavbar";

export default function AdminLayout() {
  return (
    <>
      <AuthWatcher />
      <div className="grid grid-cols-12">
        <div className="hidden overflow-visible relative z-10 lg:block lg:col-span-2 bg-slate-100 dark:bg-slate-900 min-h-screen border-r-1.5 border-slate-300 dark:border-slate-700">
          <div className="p-4 sticky top-0">
            <Link to="/admin" className="flex items-center gap-2 text-lg">
              <AcmeLogo /> Admin Panel
            </Link>
            <AdminLinks />
          </div>
        </div>
        <div className="lg:col-span-10 col-span-12">
          <AdminHeader />

          <main className="min-h-[calc(100vh-112px)] flex flex-col md:p-6 p-4">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
