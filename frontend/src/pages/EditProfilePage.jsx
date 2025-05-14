import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiUser, FiSave, FiX } from "react-icons/fi";
import { updateUserProfile } from "../api/userService";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await updateUserProfile(formData);
      setUser(response.data.user);
      navigate(`/profile`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Edit Profile
            </h1>
            <button
              onClick={() => navigate(`/profile`)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiX size={20} />
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded ${theme === 'dark' ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                } focus:outline-none focus:ring-2 ${
                  theme === 'dark' ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                }`}
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <div className="flex items-center">
                <span className={`p-3 rounded-l-lg ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                } border-r-0`}>
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`flex-1 p-3 rounded-r-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                      : 'bg-white border-gray-300 focus:border-blue-400'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                } focus:outline-none focus:ring-2 ${
                  theme === 'dark' ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                }`}
                required
                disabled
              />
              <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Contact support to change your email
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center w-full py-3 px-4 rounded-lg font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Saving..." />
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;