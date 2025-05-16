import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload, FiSave, FiX, FiLoader } from "react-icons/fi";
import { fetchVideoById, updateVideo } from "../api/videoService";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ManageVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    previewThumbnail: ""
  });

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const res = await fetchVideoById(id);
        if (res.data.data.owner._id !== user._id) {
          navigate("/");
          return;
        }
        setVideo(res.data.data);
        setFormData({
          title: res.data.data.title,
          description: res.data.data.description,
          thumbnail: null,
          previewThumbnail: res.data.data.thumbnail
        });
      } catch (error) {
        console.error("Error fetching video:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        previewThumbnail: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      if (formData.thumbnail) {
        formPayload.append("thumbnail", formData.thumbnail);
      }

      await updateVideo(id, formPayload);
      navigate(`/videos/${id}`);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Video</h1>
          <button
            onClick={() => navigate(`/videos/${id}`)}
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            }`}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Thumbnail
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-40 h-24 rounded-lg overflow-hidden">
                  <img
                    src={formData.previewThumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                  <div className="flex items-center space-x-2">
                    <FiUpload size={16} />
                    <span>Change</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                }`}
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-400'
                }`}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  updating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {updating ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}