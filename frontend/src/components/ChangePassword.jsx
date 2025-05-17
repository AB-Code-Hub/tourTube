import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiLock, FiLoader, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { changePassword } from "../api/userService";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { theme } = useTheme();
  const {user} = useAuth()
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await changePassword({
        currentPassword,
        newPassword
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
        setTimeout(() => {
     navigate(`/profile/${user?.username}`)
  }, 1300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            <FiLock className="mr-2" />
            Change Password
          </h1>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 p-3 rounded-lg flex items-center ${
                theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
              }`}
              
            >
              <FiCheck className="mr-2" />
              Password changed successfully!
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
              }`}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                }`}
                required
                minLength="6"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                }`}
                required
                minLength="6"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg flex items-center justify-center ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {loading ? (
                <FiLoader className="animate-spin mr-2" />
              ) : (
                <FiLock className="mr-2" />
              )}
              {loading ? "Changing..." : "Change Password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}