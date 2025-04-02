import { Link } from "react-router-dom";
import { FaBicycle, FaShippingFast, FaHeadset, FaShieldAlt } from "react-icons/fa";

function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-[#479182] text-white py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About Cycle Pricing Engine</h1>
            <p className="text-xl text-[#dbe2e2]">Your One-Stop Shop for Customized Cycles</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Company Introduction */}
        <div className="bg-[#e5f5f5] rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#28544B] mb-4">Welcome to Cycle Pricing Engine</h2>
          <p className="text-gray-600 mb-4">
            Cycle Pricing Engine is your premier destination for customized bicycles. We believe that every cyclist deserves a bike that perfectly matches their needs, preferences, and riding style. Our innovative platform allows you to build your dream cycle by selecting individual components, ensuring you get exactly what you want.
          </p>
          <p className="text-gray-600">
            With years of experience in the cycling industry, we&apos;ve partnered with leading manufacturers to bring you the highest quality components at competitive prices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#e5f5f5] rounded-lg shadow-md p-6 text-center">
            <FaBicycle className="w-12 h-12 text-[#28544B] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Custom Builds</h3>
            <p className="text-gray-600">Create your perfect cycle by selecting individual components</p>
          </div>
          <div className="bg-[#e5f5f5] rounded-lg shadow-md p-6 text-center">
            <FaShippingFast className="w-12 h-12 text-[#28544B] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping across India</p>
          </div>
          <div className="bg-[#e5f5f5] rounded-lg shadow-md p-6 text-center">
            <FaHeadset className="w-12 h-12 text-[#28544B] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">24/7 customer service for all your queries</p>
          </div>
          <div className="bg-[#e5f5f5] rounded-lg shadow-md p-6 text-center">
            <FaShieldAlt className="w-12 h-12 text-[#28544B] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
            <p className="text-gray-600">Safe and secure payment processing</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-[#e5f5f5] rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#28544B] mb-6">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#28544B] mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To provide cyclists with the ability to create their perfect ride through our innovative customization platform, while ensuring quality, affordability, and excellent customer service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#28544B] mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading platform for customized bicycles in India, revolutionizing how people buy and experience cycling.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-[#e5f5f5] rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#28544B] mb-6">Why Choose Cycle Pricing Engine?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-[#28544B] mr-2">✓</span>
              <span className="text-gray-600">Wide selection of high-quality components from trusted brands</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#28544B] mr-2">✓</span>
              <span className="text-gray-600">User-friendly customization interface</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#28544B] mr-2">✓</span>
              <span className="text-gray-600">Competitive pricing and regular discounts</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#28544B] mr-2">✓</span>
              <span className="text-gray-600">Expert guidance for component selection</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#28544B] mr-2">✓</span>
              <span className="text-gray-600">Secure payment and hassle-free returns</span>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-[#e5f5f5] rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#28544B] mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#28544B] mb-3">Contact Information</h3>
              <p className="text-gray-600 mb-2">Email: support@cycleadvanced.com</p>
              <p className="text-gray-600 mb-2">Phone: +91 1234567890</p>
              <p className="text-gray-600">Address: 123 Cycle Street, Bicycle City, India</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#28544B] mb-3">Business Hours</h3>
              <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600 mb-2">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Link
            to="/calculate"
            className="inline-block bg-[#28544B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a3d36] transition-colors"
          >
            Start Building Your Dream Cycle
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
