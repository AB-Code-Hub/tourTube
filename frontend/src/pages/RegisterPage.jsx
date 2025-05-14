import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiImage, FiCamera, FiX } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    coverImage: null,
  });
  const [previews, setPreviews] = useState({
    avatar: null,
    coverImage: null,
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviews((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const removeFile = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    if (!formData.avatar) newErrors.avatar = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("fullName", formData.fullName);
    data.append("password", formData.password);
    if (formData.avatar) data.append("avatar", formData.avatar);
    if (formData.coverImage) data.append("coverImage", formData.coverImage);

    try {
      await register(data);
      navigate("/");
    } catch (error) {
      // Error handling done in AuthContext
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Create Your Account</h1>
          <p className={`mt-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Join TourTube today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Image Upload */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Cover Image (Optional)
            </label>
            {previews.coverImage ? (
              <div className="relative group">
                <img
                  src={previews.coverImage}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile("coverImage")}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                theme === "dark" 
                  ? "border-gray-600 hover:border-blue-500" 
                  : "border-gray-300 hover:border-blue-400"
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className={`text-2xl mb-2 opacity-70 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Upload cover image</p>
                </div>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-x-4">
            <div className="flex-1">
              <label className={`block mb-2 font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Profile Picture
              </label>
              {previews.avatar ? (
                <div className="relative size-28">
                  <img
                    src={previews.avatar}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile("avatar")}
                    className="absolute -top-1 -right-1 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <label className={`flex items-center justify-center w-16 h-16 border-2 border-dashed rounded-full cursor-pointer ${
                  theme === "dark" 
                    ? "border-gray-600 hover:border-blue-500" 
                    : "border-gray-300 hover:border-blue-400"
                }`}>
                  <FiUser className={`text-xl opacity-70 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>
              )}
            </div>
            
          </div>

          {/* Username */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Username
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden ${
              errors.username
                ? "border-red-500"
                : theme === "dark"
                ? "border-gray-700 focus-within:border-blue-500"
                : "border-gray-300 focus-within:border-blue-400"
            }`}>
              <span className={`px-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                @
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="yourusername"
                className={`flex-1 py-2 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-500"
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Full Name
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden ${
              errors.fullName
                ? "border-red-500"
                : theme === "dark"
                ? "border-gray-700 focus-within:border-blue-500"
                : "border-gray-300 focus-within:border-blue-400"
            }`}>
              <span className={`px-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                <FiUser />
              </span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`flex-1 py-2 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-500"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Email
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden ${
              errors.email
                ? "border-red-500"
                : theme === "dark"
                ? "border-gray-700 focus-within:border-blue-500"
                : "border-gray-300 focus-within:border-blue-400"
            }`}>
              <span className={`px-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                <FiMail />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`flex-1 py-2 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Password
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden ${
              errors.password
                ? "border-red-500"
                : theme === "dark"
                ? "border-gray-700 focus-within:border-blue-500"
                : "border-gray-300 focus-within:border-blue-400"
            }`}>
              <span className={`px-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                <FiLock />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 py-2 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block mb-2 font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Confirm Password
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden ${
              errors.confirmPassword
                ? "border-red-500"
                : theme === "dark"
                ? "border-gray-700 focus-within:border-blue-500"
                : "border-gray-300 focus-within:border-blue-400"
            }`}>
              <span className={`px-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                <FiLock />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 py-2 px-2 focus:outline-none ${
                  theme === "dark" ? "bg-gray-800" : "bg-white text-gray-500"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
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
              "Create Account"
            )}
          </motion.button>

          <div className={`text-center mt-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Already have an account?{" "}
            <Link
              to="/login"
              className={`${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              } font-medium hover:underline`}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}