import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const VideoGrid = ({ videos, theme }) => (
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
              className={`flex items-center mt-2 text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
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
);


export default VideoGrid