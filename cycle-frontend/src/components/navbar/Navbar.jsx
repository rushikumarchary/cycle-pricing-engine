import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi"; // Import menu and close icons
import { useAuth } from '../../hooks/useAuth';
import logo from "../../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, logout } = useAuth();

  // Add this useEffect to handle auth state changes
  useEffect(() => {
    // This will run whenever the location changes (including after login)
    const handleAuthChange = () => {
      // Force a re-render when auth state changes
      setShowDropdown(false);
    };

    handleAuthChange();
  }, [location, userName]); // Add both location and userName as dependencies

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#28544B] text-white flex justify-between items-center p-4 shadow-md z-50">
      {/* Logo */}
      <Link to="/">
      <h3 className="font-bold text-2xl">
            Cycle<span className="text-[#FFC107]">estimate</span>
          </h3>
      </Link>

      {/* Menu Button for small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Navigation Links - Hidden on small screens, visible on md+ */}
      <span className="hidden md:flex items-center">
        <Link
          to="/"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          Home
        </Link>
        <Link
          to="/calculateForm"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          Calculate Price
        </Link>
        <Link
          to="/estimates"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          Estimated Price
        </Link>
        <Link
          to="/about"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          About
        </Link>
      </span>

      {/* User Section with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {userName ? (
          <>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
            >
              <span className="text-lg">{userName}</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-[#374151] hover:bg-[#f8fafc] flex items-center gap-2"
                >
                  <FiUser />
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#374151] hover:bg-[#f8fafc] flex items-center gap-2"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/signIn"
            className="px-4 text-lg p-1 bg-[#0f2e64] hover:bg-[#0f2e64] transition-colors duration-300 rounded"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#4f46e5] p-4 flex flex-col items-center md:hidden">
          <Link
            to="/"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/calculateForm"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            Calculate Price
          </Link>
          <Link
            to="/estimates"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            Estimated Price
          </Link>
          {userName && (
            <>
              <button
                className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;