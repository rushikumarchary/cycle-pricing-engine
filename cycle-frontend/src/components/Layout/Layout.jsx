import { Outlet, useLocation } from "react-router-dom";

import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

function Layout() {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isAboutPage ? 'bg-white' : 'bg-[#ACBD86]'} pt-[72px]`}>
        <div className={`${isAboutPage ? '' : 'container mx-auto px-4 py-6'}`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
