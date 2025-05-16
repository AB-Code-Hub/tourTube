import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllVideos } from "../api/videoService";
import { useTheme } from "../contexts/ThemeContext";
import { FiClock, FiEye } from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner";

export default function VideoRecommendations({ currentVideoId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        setLoading(true);
        const res = await fetchAllVideos();
        
        // Filter out the current video and limit to 6 recommendations
        const filteredVideos = res.data.data?.videos
          .filter(video => video._id !== currentVideoId)
          .slice(0, 6);
        setVideos(filteredVideos);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedVideos();
  }, [currentVideoId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4 line-clamp-2">
      <h3 className={`text-lg font-semibold ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Recommended Videos
      </h3>
      
      {videos.length === 0 ? (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No recommendations available
        </p>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <motion.div
              key={video._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to={`/videos/${video._id}`}
                className="block"
              >
                <div className="flex space-x-3">
                  <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute bottom-1 right-1 px-1 text-xs rounded ${
                      theme === 'dark' ? 'bg-gray-900/80 text-white' : 'bg-white/90 text-gray-900'
                    }`}>
                      {video.duration || '0:00'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {video.title}
                    </h4>
                    <div className={`mt-1 text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <p>{video.owner?.username || 'Unknown'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="flex items-center">
                          <FiEye className="mr-1" size={12} /> {video.views || 0}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" size={12} /> {video.duration || '0:00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}