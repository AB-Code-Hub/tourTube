import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { FiUser, FiVideo, FiUpload, FiCamera, FiImage } from "react-icons/fi";
import { fetchUserVideos } from "../api/videoService";
import LoadingSpinner from "../components/LoadingSpinner";
import UpdateAvatar from "./UpdateAvatar";
import UpdateCoverImage from "./UpdateCoverImage";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [profileUser, setProfileUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the user profile data here
        // For now, we'll assume it's the current user if username matches

        // Fetch user's videos
        const videosResponse = await fetchUserVideos(username);
        setProfileUser(user);
        setVideos(videosResponse.data?.data?.videos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white inline-block`}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-72 w-full bg-gradient-to-r from-purple-500 to-blue-600">
        {profileUser?.coverImage && (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative -mt-20">
              {profileUser?.avatar ? (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.fullName}
                  className="w-32 h-32 rounded-full border-4 object-cover"
                  style={{
                    borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  }}
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                  style={{
                    borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  }}
                >
                  <FiUser
                    size={48}
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {profileUser?.fullName}
              </h1>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                @{profileUser?.username}
              </p>
            </div>

            {user && (
              <>
                <Link
                  to="/upload"
                  className={`flex items-center px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  <FiUpload className="mr-2" />
                  Upload Video
                </Link>
                <Link
                  to="/profile/edit"
                  className={`flex items-center px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  <FiUser className="mr-2" />
                  Edit Profile
                </Link>

                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <FiCamera className="mr-2" />
                  Change Avatar
                </button>
                <button
                  onClick={() => setIsCoverModalOpen(true)}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  <FiImage className="mr-2" />
                  Change Cover
                </button>
              </>
            )}

            {isAvatarModalOpen && (
              <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <UpdateAvatar onClose={() => setIsAvatarModalOpen(false)} />
              </div>
            )}

            {isCoverModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <UpdateCoverImage onClose={() => setIsCoverModalOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container mx-auto px-4 py-8">
        <div
          className={`mb-6 flex items-center justify-between ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          <h2 className="text-xl font-bold flex items-center">
            <FiVideo className="mr-2" />
            Uploaded Videos
          </h2>
          <span className="text-sm">
            {videos.length} {videos.length === 1 ? "video" : "videos"}
          </span>
        </div>

        {videos.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FiVideo size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">No videos uploaded yet</h3>
            {/* {username === currentUser?.username && (
              <Link
                to="/upload"
                className={`mt-4 inline-block px-4 py-2 rounded-full ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Upload Your First Video
              </Link>
            )} */}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {videos.map((video) => (
              <motion.div
                key={video._id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
                whileHover={{ scale: 1.03 }}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-750"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <Link to={`/videos/${video._id}`}>
                  <div
                    className={`relative aspect-video ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {video.duration || "0:00"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3
                      className={`font-semibold line-clamp-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {video.title}
                    </h3>
                    <div
                      className="flex items-center mt-2 text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }"
                    >
                      <span>{video.views || 0} views</span>
                      <span className="mx-1">•</span>
                      <span>
                        {video.createdAt
                          ? new Date(video.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
