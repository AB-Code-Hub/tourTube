import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  fetchUserVideos,
  deleteVideo,
  toggleVideoVisibility,
} from "../api/videoService";
import { FiEye, FiEyeOff, FiTrash2, FiLoader } from "react-icons/fi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function VideoManagementPage() {
  const { theme } = useTheme();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetchUserVideos(user?._id);
        const videosData = response.data?.data?.videos || [];
        setVideos(videosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user?._id]);

  const handleDelete = async (videoId) => {
    try {
      await deleteVideo(videoId);
      setVideos(videos.filter((v) => v._id !== videoId));
      setVideoToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleToggleVisibility = async (videoId, currentVisibility) => {
    try {
      const response = await toggleVideoVisibility(videoId);
      const updatedVideo = response.data?.data;

      if (updatedVideo) {
        setVideos(
          videos.map((v) =>
            v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
          )
        );
      }
    } catch (err) {
      console.error("Error toggling visibility:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <FiLoader className="animate-spin text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Videos</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Manage Your Videos</h1>

        {videos.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <p className="text-lg">No videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {videos?.map((video) => (
              <div
                key={video._id}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  theme === "dark"
                    ? "bg-gray-800"
                    : "bg-white border border-gray-200"
                }`}
              >
               <Link to={`/videos/${video?._id}`}>
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-16 rounded overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {video.title}
                    </h3>{" "}
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {video.isPublished ? "Public" : "Private"} •{" "}
                      {video.views || 0} views
                    </p>
                  </div>
                </div>
               </Link>

                <div className="flex space-x-2">
                  {" "}
                  <button
                    onClick={() =>
                      handleToggleVisibility(video._id, video.isPublished)
                    }
                    className={`p-2 rounded-full ${
                      video.isPublished
                        ? theme === "dark"
                          ? "bg-green-900/30 text-green-400 hover:bg-green-800/40"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    title={
                      video.isPublished ? "Unpublish video" : "Publish video"
                    }
                  >
                    {video.isPublished ? (
                      <FiEye size={18} />
                    ) : (
                      <FiEyeOff size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setVideoToDelete(video)}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                    title="Delete video"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {videoToDelete && (
          <ConfirmDeleteModal
            isOpen={!!videoToDelete}
            onClose={() => setVideoToDelete(null)}
            onConfirm={() => handleDelete(videoToDelete._id)}
            title="Delete Video"
            message={`Are you sure you want to delete "${videoToDelete.title}"? This action cannot be undone.`}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
