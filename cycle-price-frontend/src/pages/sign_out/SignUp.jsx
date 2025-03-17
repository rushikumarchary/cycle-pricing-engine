import { Link } from "react-router-dom";

import loginImage from "../../assets/login.png";
function SignUp() {
  return (
    <>
      <section
        className="text-gray-600 body-font"
        style={{ backgroundImage: `url(${loginImage})` }}
      >
        <div className="container px-5 py-14 mx-auto flex flex-wrap items-center">
          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 opacity-95 rounded-lg p-8 flex flex-col md:m-auto  mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Sign Up
            </h2>
            <div className="relative mb-4">
              <label
                htmlFor="full-name"
                className="leading-7 text-sm text-gray-600"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
              Sign Up
            </button>
            <div className="mt-6 text-center">
              <div className="text-sm text-yellow-950">
                Do have an account?{" "}
                <Link to="/signIn">
                  <span className="mr-10 text-base font-semibold hover:text-gray-900 cursor-pointer text-indigo-500 hover:underline">
                    Sign In
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
