import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAllVideos } from "../api/videoService";
import { useTheme } from "../contexts/ThemeContext";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme(); // Properly use the theme context

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetchAllVideos();
        setPosts(response.data?.data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

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
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {" "}
        {loading ? (
          <div className="h-64">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No videos found</h3>
                <p className="mt-2 opacity-80">
                  Upload your first video to get started
                </p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {posts.map((post, index) => (
                  <Link key={index} to={`/videos/${post?._id}`}>
                    <motion.div
                      key={post?._id}
                      variants={item}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-750"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Video/Image Thumbnail */}
                      <div
                        className={`relative aspect-video ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {post.videoFile ? (
                          <video
                            className="w-full h-full object-cover"
                            poster={post.thumbnail}
                            src={post.videoFile}
                            muted
                            loop
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {post.duration || "0:00"}
                        </div>
                      </div>

                      {/* Post Info */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          {post.owner?.avatar ? (
                            <img
                              src={post.owner.avatar}
                              alt={post.owner.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              <FiUser
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-2 text-sm">
                              {post.title}
                            </h3>
                            <p className="text-xs opacity-80 truncate">
                              {post.owner?.username || "Unknown user"}
                            </p>
                            <div className="flex items-center text-xs mt-1 space-x-3 text-gray-500 dark:text-gray-400">
                              <span>{post.views || 0} views</span>
                              <span>
                                {post.createdAt
                                  ? new Date(
                                      post.createdAt
                                    ).toLocaleDateString()
                                  : "Unknown date"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
