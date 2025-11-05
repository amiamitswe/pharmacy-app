import React from "react";

function PageHeader({ label }) {
  return (
    <div className="bg-linear-to-r from-cyan-700 via-cyan-500 to-cyan-700 lg:p-6 p-4">
      <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold tracking-wider text-center text-white uppercase">
        {label}
      </h1>
      <div className="mx-auto lg:mt-4 mt-2 h-1 lg:max-w-80 max-w-60 rounded-full bg-white" />
    </div>
  );
}

export default PageHeader;
