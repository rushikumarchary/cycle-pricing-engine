import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to CycleEstimate
          </h1>
          <p className="text-indigo-100 text-lg">
            Your one-stop solution for bicycle valuation
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Quick Navigation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Navigation Cards */}
            <NavigationCard
              to="/brand"
              title="Brands"
              description="Explore bicycle brands and manufacturers"
              bgColor="bg-gradient-to-r from-green-600 to-green-800"
              icon="🏆"
            />

            <NavigationCard
              to="/items"
              title="Items"
              description="Browse our catalog of bicycle parts"
              bgColor="bg-gradient-to-r from-green-500 to-green-700"
              icon="🚲"
            />

            {/* <NavigationCard
              to="/about"
              title="About Us"
              description="Learn more about our services"
              bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
              icon="ℹ️"
            />

            <NavigationCard
              to="/estimates"
              title="Estimates"
              description="Get pricing estimates for your bicycle"
              bgColor="bg-gradient-to-r from-blue-700 to-blue-900"
              icon="💰"
            /> */}
          </div>

          {/* Account Section */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signIn"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all text-center"
            >
              Sign In to Your Account
            </Link>

            <Link
              to="/signUp"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-300 to-orange-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all text-center"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-600 text-sm">
        © 2025 CycleEstimate - Professional Bicycle Valuation
      </p>
    </div>
  );
}

// Navigation Card Component
function NavigationCard({ to, title, description, bgColor, icon }) {
  return (
    <Link to={to} className="block group hover:shadow-lg transition-all">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className={`${bgColor} p-4 flex items-center justify-between`}>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="p-4 bg-white">
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default Home;
