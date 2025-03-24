import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaInstagram,
  FaRegCopyright,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* <footer className="bg-[#0f2e64] text-white"> */}
      <footer className="bg-[#547265] text-white">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 md:mx-0 mx-auto text-center md:text-left ">
            <h3 className="font-bold text-2xl">
              {t("cycle")}
              <span className="text-[#FFC107]">{t("PricingEngine")}</span>
            </h3>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10  md:mt-0 mt-10 md:text-left text-center ">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium tracking-widest text-white text-lg mb-3">
                MENU
              </h2>

              <ul className="list-none mb-10">
                <li className="mt-1">Features</li>
                <li className="mt-1">Info Center</li>
                <li className="mt-1">News Blog</li>
              </ul>
            </div>

            <div className="lg:w-1/4 md:w-1/2 w-full  px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-lg mb-3">
                COMPANY
              </h2>

              <ul className="list-none mb-10">
                <li className="mt-1">
                  {" "}
                  <Link
                    to="/about"
                    className="hover:underline transition-colors duration-300 rounded"
                  >
                    {t("About")}
                  </Link>
                </li>
                <li className="mt-1">Privacy Policy</li>
                <li className="mt-1">Term & Condition</li>
              </ul>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-white tracking-widest text-lg mb-3">
                CONTACT
              </h2>

              <ul className="list-none mb-10">
                <li className="mt-1">Contact Sales</li>
                <li className="mt-1">Email</li>
                <li className="mt-1">contact@cycleengine.com</li>
              </ul>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font text-white font-medium tracking-widest text-lg mb-3">
                TECH SUPPORT
              </h2>

              <ul className="list-none mb-10">
                <li className="mt-1">Contact Support</li>
                <li className="mt-1">Info Center</li>
                <li className="mt-1">Activate</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-[#365547] text-white">
          <div className="container mx-auto py-4 flex flex-col sm:flex-row items-center justify-between px-4">
            {/* Copyright Section */}
            <p className="text-sm text-center sm:text-left flex items-center">
              <FaRegCopyright className="mr-1" /> 2025 Itrosys -{" "}
              <span className="ml-1">@copyright</span>
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-gray-300">
                <FaFacebook size={25} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <FaInstagram size={25} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <FaTwitter size={25} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
