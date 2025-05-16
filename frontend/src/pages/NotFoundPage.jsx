import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiFrown } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0.8, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-9xl font-bold mb-4 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          404
        </motion.div>

        {/* Icon with Animation */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 500 }}
          className={`inline-block p-4 rounded-full mb-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <FiFrown
            size={48}
            className={`${
              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
            }`}
          />
        </motion.div>

        {/* Title */}
        <h1
          className={`text-3xl font-bold mb-3 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Oops! Page Not Found
        </h1>

        {/* Description */}
        <p
          className={`text-lg mb-8 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back Button */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <FiArrowLeft className="mr-2" />
            Return to Home
          </Link>
        </motion.div>

        {/* Additional Help */}
        <p
          className={`mt-8 text-sm ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Need help?{" "}
          <a
            href="/contact"
            className={`underline ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          >
            Contact support
          </a>
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
        >
          <path
            d="M50 0L100 50L50 100L0 50L50 0Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="absolute top-10 right-10 opacity-20">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className={theme === "dark" ? "text-yellow-400" : "text-yellow-500"}
        >
          <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </motion.div>
  );
}