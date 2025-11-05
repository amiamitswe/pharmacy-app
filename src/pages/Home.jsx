import HomeMedicineList from "../components/home/HomeMedicineList";
// import HeroSection from "../components/home/HeroSection";

export default function Home() {
  return (
    <div>
      {/* <HeroSection /> */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-130px)] flex flex-col justify-between">
        <HomeMedicineList />
      </div>
    </div>
  );
}
