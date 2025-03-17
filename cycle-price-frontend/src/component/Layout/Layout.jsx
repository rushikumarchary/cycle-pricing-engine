import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
function Layout() {
  return (
    <div>
      <Navbar />
      <div className="bg-[eef2ff]" style={{marginTop: "4.5rem" }}>
        <Outlet /> {/* Content starts below the navbar */}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
