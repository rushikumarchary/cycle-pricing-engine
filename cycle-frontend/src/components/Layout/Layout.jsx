import { Outlet } from "react-router-dom";

import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-[#ACBD86] pt-[72px]">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
