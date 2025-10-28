import { Outlet } from "react-router";
import CustomNavbar from "../components/layout/CustomNavbar";
import Footer from "../components/layout/Footer";

export default function PublicLayout() {
  return (
    <>
      <CustomNavbar />
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-130px)] flex flex-col justify-between">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
