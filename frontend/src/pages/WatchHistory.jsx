import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiEye, FiCalendar, FiHeart } from "react-icons/fi";
import { fetchWatchHistory } from "../api/userService";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function WatchHistory() {
  const { theme } = useTheme();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWatchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetchWatchHistory();
        setVideos(res.data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWatchHistory();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading History</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white inline-block`}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FiClock className="mr-2" />
          Watch History
        </h1>

        {videos.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}>
            <FiClock size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">No watch history yet</h3>
            <p className="mt-2">Videos you watch will appear here</p>
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
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Link to={`/video/${video._id}`}>
                  <div className={`relative aspect-video ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
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
                    <h3 className={`font-semibold line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {video.title}
                    </h3>
                    <div className={`flex items-center mt-2 text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span>{video.views || 0} views</span>
                      <span className="mx-1">•</span>
                      <span>
                        {video.createdAt
                          ? new Date(video.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      {video.owner?.avatar ? (
                        <img
                          src={video.owner.avatar}
                          alt={video.owner.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={14} />
                        </div>
                      )}
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {video.owner?.username}
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
}