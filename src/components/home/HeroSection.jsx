import { Divider, Image } from "@heroui/react";
import React from "react";
import heroImage from "../../assets/home/hero.webp";

function HeroSection() {
  return (
    <div className="w-full relative">
      <div className="h-72 md:h-full">
      <Image classNames={{
        wrapper: "h-full"
      }} src={heroImage} radius="none" className="h-full w-full object-cover" />
      </div>
      <div className="absolute top-1/2 md:left-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10/12 md:w-auto">
        <div className="flex flex-col gap-2">
          <h1 className="xl:text-7xl lg:text-5xl text-4xl bg-linear-to-r from-indigo-500 to-indigo-950 bg-clip-text text-transparent font-normal uppercase tracking-wider">
            one stop <span className="font-bold block">solution</span>
          </h1>
          <p className="xl:text-4xl lg:text-2xl text-xl font-normal text-indigo-900">
            to all your medicine needs
          </p>
          <Divider className="h-0.5 w-2/3 bg-indigo-950 lg:my-2 my-1" />
          <p className="xl:text-2xl lg:text-xl text-lg text-indigo-950">
            We're available 24/7, Order Now &
          </p>
          <p className="xl:text-2xl lg:text-xl text-lg text-white bg-indigo-950 w-fit px-2 py-1 rounded capitalize">
            get an Instant 10% off
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
