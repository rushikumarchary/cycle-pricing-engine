import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCalculator, FaBicycle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { authAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext";

function SignIn() {
  const { login } = useAuth();
  const { updateCartCount } = useCart();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "/";

  const validateUsername = (username) => {
    if (!username) return t('required');
    if (username.includes("@")) return t('usernameNoAt');
    if (username !== username.toLowerCase())
      return t('usernameLowercase');
    if (!/^[a-z0-9_-]+$/.test(username))
      return t('usernameFormat');
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return t('required');
    if (password.length < 8) return t('minimumLength', { length: 8 });
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      username: formData.username.toLowerCase(),
    };

    Swal.fire({
      title: "Signing In...",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = await authAPI.signIn(submissionData);
      if (token) {
        // First login with the token
        login(token);

        try {
          // Then fetch cart count using the auth API
          const cartCount = await authAPI.getCartCount();
          updateCartCount(cartCount);
        } catch (error) {
          console.error("Error fetching cart count:", error);
          // Set cart count to 0 if there's an error
          updateCartCount(0);
        }

        await Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
        });
        
        navigate(redirectTo);
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials. Please try again.",
      });
      setErrors({
        username: "Invalid username or password",
        password: "Invalid username or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Welcome Message */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-8 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90"></div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="flex justify-center items-center mb-8">
            <FaBicycle className="text-6xl mr-4" />
            <FaCalculator className="text-6xl" />
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Welcome to Cycle Pricing Engine
          </h1>
          <p className="text-xl mb-8">
            Calculate precise and competitive prices for your cycles with our
            advanced pricing engine.
          </p>
          <div className="space-y-4 text-lg">
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Accurate Market-Based Pricing</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Real-time Price Updates</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Comprehensive Brand Analysis</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-700 to-transparent"></div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Welcome back! Please enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your username"
              />
              {/* {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )} */}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to={`/signUp?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
