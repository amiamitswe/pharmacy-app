import { Outlet } from "react-router";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";

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
