import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(credentials);
      navigate("/");
    } catch (error) {
      // Errors are handled in AuthContext
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!credentials.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!credentials.password) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-gray-900 font-medium text-lg" : "bg-gray-50 font-normal"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600  mb-2">Welcome Back</h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sign in to your TourTube account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block mb-2 font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div
              className={`flex items-center border rounded-lg overflow-hidden ${
                errors.email
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-700 focus-within:border-blue-500"
                  : "border-gray-300 focus-within:border-blue-400"
              }`}
            >
              <span
                className={`px-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`flex-1 py-3 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-700"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div
              className={`flex items-center border rounded-lg overflow-hidden ${
                errors.password
                  ? "border-red-500"
                  : theme === "dark"
                  ? "border-gray-700 focus-within:border-blue-500"
                  : "border-gray-300 focus-within:border-blue-400"
              }`}
            >
              <span
                className={`px-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <FiLock />
              </span>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 py-3 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-700"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
           
            <Link
              to="/forgot-password"
              className={`text-sm ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              } hover:underline`}
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}
          >
            {loading ? (
              <LoadingSpinner size={5} text="" />
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        <div
          className={`mt-6 text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className={`${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            } font-medium hover:underline`}
          >
            Sign up
          </Link>
        </div>
      </div>
    </motion.div>
  );
}