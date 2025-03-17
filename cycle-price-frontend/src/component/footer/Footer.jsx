import {
  FaFacebook,
  FaInstagram,
  FaRegCopyright,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white">
        <div className="container px-6 py-16 mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Logo Section */}
            <div className="md:w-1/5">
              <h3 className="font-bold text-3xl mb-4 tracking-wide">
                Cycle
                <span className="text-red-500 font-extrabold">estimate</span>
              </h3>
              <p className="text-gray-200 mt-4 text-sm">
                Providing accurate bicycle and parts valuation services since
                2023.
              </p>
            </div>

            {/* Menu Sections */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* MENU Section */}
              <div>
                <h2 className="font-semibold text-xl mb-4 after:content-[''] after:block after:w-10 after:h-1 after:bg-red-500 after:mt-2">
                  MENU
                </h2>
                <ul className="space-y-3">
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Features
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Info Center
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    News Blog
                  </li>
                </ul>
              </div>

              {/* COMPANY Section */}
              <div>
                <h2 className="font-semibold text-xl mb-4 after:content-[''] after:block after:w-10 after:h-1 after:bg-red-500 after:mt-2">
                  COMPANY
                </h2>
                <ul className="space-y-3">
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    About Us
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Privacy Policy
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Term & Condition
                  </li>
                </ul>
              </div>

              {/* CONTACT Section */}
              <div>
                <h2 className="font-semibold text-xl mb-4 after:content-[''] after:block after:w-10 after:h-1 after:bg-red-500 after:mt-2">
                  CONTACT
                </h2>
                <ul className="space-y-3">
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Contact Sales
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Email
                  </li>
                  <li className="text-gray-200">contact@cycleengin.com</li>
                </ul>
              </div>

              {/* TECH SUPPORT Section */}
              <div>
                <h2 className="font-semibold text-xl mb-4 after:content-[''] after:block after:w-10 after:h-1 after:bg-red-500 after:mt-2">
                  TECH SUPPORT
                </h2>
                <ul className="space-y-3">
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Contact Support
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Info Center
                  </li>
                  <li className="hover:text-red-300 transition-colors cursor-pointer">
                    Activate
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Social Icons */}
        <div className="bg-indigo-800 py-6">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
            {/* Copyright Section */}
            <p className="text-sm flex items-center opacity-80">
              <FaRegCopyright className="mr-1" /> 2025 Itrosys -{" "}
              <span className="ml-1">@copyright</span>
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-red-300 transition-colors">
                <FaFacebook size={22} />
              </a>
              <a href="#" className="hover:text-red-300 transition-colors">
                <FaInstagram size={22} />
              </a>
              <a href="#" className="hover:text-red-300 transition-colors">
                <FaTwitter size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
