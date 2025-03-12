import { Outlet } from "react-router-dom";

import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* <main className="flex-grow bg-gradient-to-r from-[#0A192F] to-[#1E3A8A]  pt-16"> */}
      <main className="flex-grow bg-[#ACBD86]  pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
