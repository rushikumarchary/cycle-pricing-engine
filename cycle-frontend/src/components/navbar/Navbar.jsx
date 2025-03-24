import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiShoppingCart } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { LuBaggageClaim } from "react-icons/lu";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { hasManagementAccess } from "../../utils/auth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManageDropdown, setShowManageDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const manageDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userEmail, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { t } = useTranslation();

  // Add click outside handler for manage dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (manageDropdownRef.current && !manageDropdownRef.current.contains(event.target)) {
        setShowManageDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add this useEffect to handle auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      setShowDropdown(false);
      setShowManageDropdown(false);
    };
    handleAuthChange();
  }, [location, userName]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#28544B] text-white flex justify-between items-center p-4 shadow-md z-50">
      {/* Logo */}
      <Link to="/">
        <h3 className="font-bold text-2xl">
          {t('cycle')}
          <span className="text-[#FFC107]">{t('PricingEngine')}</span>
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
          {t('home')}
        </Link>
        <Link
          to="/calculate"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          {t('calculate')}
        </Link>
        <Link
          to="/about"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded"
        >
          {t('About')}
        </Link>
        {hasManagementAccess() && (
          <div className="relative" ref={manageDropdownRef}>
            <button
              onClick={() => setShowManageDropdown(!showManageDropdown)}
              className="px-4 text-lg  p-1 text-[#dbe2e2] hover:bg-[#FF6B35] transition-colors duration-300 rounded flex items-center gap-1"
            >
              Manage
              <span className={`transition-transform  duration-200 ${showManageDropdown ? 'rotate-180' : ''}`}><FaCaretDown /></span>
            </button>
            {showManageDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                <Link
                  to="/brand"
                  onClick={() => setShowManageDropdown(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Brands
                </Link>
                <Link
                  to="/items"
                  onClick={() => setShowManageDropdown(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Items
                </Link>
              </div>
            )}
          </div>
        )}
      </span>

      {/* Right side items */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="border-r border-[#3a6960] pr-4">
          <LanguageSwitcher />
        </div>
        
        <Link
          to="/cart"
          className="px-4 text-lg p-1 text-[#dbe2e2] hover:bg-[#776862] transition-colors duration-300 rounded flex items-center relative"
        >
          <FiShoppingCart className="text-2xl" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* User Section with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {userName ? (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-[#dbe2e2] hover:bg-[#bb9587] transition-colors duration-300 rounded-full relative group"
              >
                <CgProfile className="text-3xl" />
                {/* Tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap transition-opacity duration-200 pointer-events-none ${
                    showDropdown
                      ? "opacity-0"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {userName}
                  {/* Triangle */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 border-4 border-transparent border-b-gray-800"></div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-sm text-gray-600">{userEmail}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-center px-4 py-2 text-[#374151] hover:bg-[#9c7b7f] flex items-center justify-center gap-2 border-b border-gray-200"
                  >
                    <LuBaggageClaim />
                    {t('orders')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-4 py-2 text-[#374151] hover:bg-[#9c7b7f] flex items-center justify-center gap-2"
                  >
                    <FiLogOut />
                    {t('logout')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/signIn"
              className="px-4 text-lg p-1 bg-[#0f2e64] hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#4f46e5] p-4 flex flex-col items-center md:hidden">
          <Link
            to="/"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            {t('home')}
          </Link>
          <Link
            to="/calculate"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            {t('calculate')}
          </Link>
          <Link
            to="/about"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            {t('About')}
          </Link>
          {hasManagementAccess() && (
            <>
              <Link
                to="/brand"
                className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
                onClick={() => setIsOpen(false)}
              >
                 Brands
              </Link>
              <Link
                to="/items"
                className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
                onClick={() => setIsOpen(false)}
              >
                 Items
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
