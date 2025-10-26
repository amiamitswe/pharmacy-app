import { Button } from "@heroui/react";
import PageTopContent from "./components/common/PageTopContent";
import CustomNavbar from "./components/layout/CustomNavbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-130px)] flex flex-col justify-between">
      <CustomNavbar />
        {/* <PageTopContent /> */}
        <p>Coming soon</p>
        <Button color="primary">Button</Button>
        <Footer />
      </div>
    </>
  );
}

export default App;
