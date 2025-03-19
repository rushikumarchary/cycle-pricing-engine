import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaBicycle, FaTools, FaCogs } from "react-icons/fa";
import DomainName from "../../utils/config";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "/";

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.includes("@")) return "Username cannot contain @";
    if (username !== username.toLowerCase())
      return "Username must be lowercase";
    if (username.length < 6) return "Username must be at least 6 characters";
    if (!/^[a-z0-9_-]+$/.test(username))
      return "Username can only contain lowercase letters, numbers, underscores, and hyphens";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password, username, email) => {
    if (password.toLowerCase().includes(username.toLowerCase())) {
      return "Password cannot contain your username";
    }
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(password))
      return "Password must contain at least one special character (!@#$%^&*)";

    const emailPrefix = email.split("@")[0].toLowerCase();
    if (password.toLowerCase().includes(emailPrefix)) {
      return "Password cannot contain your email address";
    }
    if (password.toLowerCase().includes(username.toLowerCase())) {
      return "Password cannot contain your username";
    }

    // Dynamic check for any email
    const emailWithAt = emailPrefix + "@";
    if (password.toLowerCase().includes(emailWithAt)) {
      return `Password cannot contain '${emailWithAt}'`;
    }

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
      email: validateEmail(formData.email),
      password: validatePassword(
        formData.password,
        formData.username,
        formData.email
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show loading alert
    Swal.fire({
     
      title: "Creating Account...",
      html: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(`${DomainName}/auth/signUp`, formData);

      // Close loading alert and show success message
      // await Swal.fire({
      //   icon: "success",
      //   title: "Registration Successful!",
      //   text: "Please login with your credentials",
      //   showConfirmButton: true,
      // });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          // Remove hover handlers so timer continues
        },
      });
      Toast.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created successfully. You will be redirected to the login page to access your account.",
      }).then(() => {
        navigate(`/signIn?redirectTo=${encodeURIComponent(redirectTo)}`);
      });

      // Redirect to login while preserving the original redirect path
      
    } catch (error) {
      // Close the loading alert first
      Swal.close();

      //handle error
      if (error.response?.status === 406) {
        const errorMessage = error.response.data;

        // Update the corresponding error state based on the error message
        if (errorMessage.includes("Username")) {
          setErrors((prev) => ({
            ...prev,
            username: "This username is already taken",
          }));
        }
        if (errorMessage.includes("Email")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        }
      }
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data || "Server is down, please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Welcome Message */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-8 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-90"></div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="flex justify-center items-center gap-4 mb-8">
            <FaBicycle className="text-6xl" />
            <FaTools className="text-5xl" />
            <FaCogs className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Join Our Cycle Pricing Community
          </h1>
          <p className="text-xl mb-8">
            Get started with the most advanced cycle pricing calculator in the
            market.
          </p>
          <div className="space-y-4 text-lg">
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Smart Price Recommendations</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Market Trend Analysis</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Brand Value Insights</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Competitive Price Tracking</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-indigo-700 to-transparent"></div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us to start calculating cycle prices
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
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Choose a username (lowercase letters, numbers, _, -)"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
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
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 pr-10`}
                  placeholder="Create a strong password"
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
                <>
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                <div className="mt-2 text-xs text-gray-500">
                Password must contain:
                <ul className="list-disc list-inside mt-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%^&*)</li>
                </ul>
              </div>
              </>
              )}
             
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              Create Account
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signIn"
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
