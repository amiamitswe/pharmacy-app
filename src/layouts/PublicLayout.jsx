import { Outlet } from "react-router";
import CustomNavbar from "../components/layout/CustomNavbar";
import Footer from "../components/layout/Footer";

export default function PublicLayout() {
  return (
    <>
      <CustomNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
