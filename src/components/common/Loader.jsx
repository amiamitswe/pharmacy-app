import React from "react";

function Loader() {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 bg-stone-800 text-slate-200">
      <span className="custom_loader"></span>
      <p className="text-xl">🔄 Loading...</p>
    </div>
  );
}

export default Loader;
