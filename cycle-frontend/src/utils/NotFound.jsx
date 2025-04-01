import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <div className="mb-8">
          <div className="h-1 w-16 bg-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <FaHome className="text-xl" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 