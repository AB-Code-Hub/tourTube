import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiUser, FiCamera, FiX, FiUpload } from "react-icons/fi";
import { updateUserAvatar } from "../api/userService";
import LoadingSpinner from "../components/LoadingSpinner";
const UpdateAvatar = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await updateUserAvatar(formData);
      setUser(response.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Update Profile Picture
        </h2>
        <button
          onClick={onClose}
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
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover border-2"
                  style={{ borderColor: theme === 'dark' ? '#374151' : '#E5E7EB' }}
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-0 right-0 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                >
                  <FiX size={16} />
                </button>
              </>
            ) : (
              <label className={`flex items-center justify-center w-full h-full rounded-full cursor-pointer border-2 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
              }`}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Current avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-4xl opacity-70" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <label className={`flex items-center justify-center px-4 py-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          } cursor-pointer`}>
            <FiCamera className="mr-2" />
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <p className={`mt-2 text-xs text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Recommended size: 500x500 pixels. JPG, PNG, or GIF.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2 px-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || loading}
            className={`flex-1 py-2 px-4 rounded-lg font-medium ${
              !file || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? <LoadingSpinner size="sm" text="Uploading..." /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAvatar;