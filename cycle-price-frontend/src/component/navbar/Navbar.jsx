import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; 
import logo from "../../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-gray-800 shadow-lg"
          : "bg-gradient-to-r from-indigo-900 to-indigo-700 text-white"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="w-16 h-12 object-contain" />
      </Link>

      {/* Menu Button for small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FiX
            className={`text-2xl ${scrolled ? "text-gray-800" : "text-white"}`}
          />
        ) : (
          <FiMenu
            className={`text-2xl ${scrolled ? "text-gray-800" : "text-white"}`}
          />
        )}
      </button>

      {/* Navigation Links - Hidden on small screens, visible on md+ */}
      <span className="hidden md:flex items-center space-x-2">
        <Link
          to="/"
          className={`px-4 text-sm font-medium py-2 rounded-md ${
            scrolled
              ? "hover:bg-gray-100 text-gray-800"
              : "hover:bg-indigo-800 text-white"
          }`}
        >
          Home
        </Link>
        <Link
          to="/calculateForm"
          className={`px-4 text-sm font-medium py-2 rounded-md ${
            scrolled
              ? "hover:bg-gray-100 text-gray-800"
              : "hover:bg-indigo-800 text-white"
          }`}
        >
          Calculate Price
        </Link>
        <Link
          to="/estimates"
          className={`px-4 text-sm font-medium py-2 rounded-md ${
            scrolled
              ? "hover:bg-gray-100 text-gray-800"
              : "hover:bg-indigo-800 text-white"
          }`}
        >
          Estimated Price
        </Link>
      </span>

      {/* Login Button */}
      <Link
        to="/signIn"
        className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
          scrolled
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-white hover:bg-gray-100 text-indigo-800"
        }`}
      >
        Login
      </Link>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg py-2 md:hidden">
          <Link
            to="/"
            className="block w-full text-center py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/calculateForm"
            className="block w-full text-center py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Calculate Price
          </Link>
          <Link
            to="/estimates"
            className="block w-full text-center py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Estimated Price
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
