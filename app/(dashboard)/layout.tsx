import Navbar from "@/components/Navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col md:flex-row">
      <Navbar />
      <div className="w-full overflow-y-auto">{children}</div>
    </div>
  );
}

export default layout;
