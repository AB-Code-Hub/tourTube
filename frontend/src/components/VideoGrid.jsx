import { motion } from 'framer-motion';
import { FiTrash2, FiPlay, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const VideoGrid = ({ videos, theme, showRemove = false, onRemove = null }) => {
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {videos.map((video) => (
        <motion.div
          key={video._id}
          variants={item}
          whileHover={{ scale: 1.03 }}
          className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-750'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <Link to={`/videos/${video._id}`} className="block">
            <div
              className={`relative aspect-video ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                <FiPlay
                  size={48}
                  className="text-white transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {video.duration || '0:00'}
              </div>
            </div>
          </Link>
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <Link
                to={`/profile/${video.owner?.username}`}
                className="flex-shrink-0"
              >
                {video.owner?.avatar ? (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <FiUser
                      className={
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }
                    />
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold line-clamp-2 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  {video.title}
                </h3>
                <Link
                  to={`/profile/${video.owner?.username}`}
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } hover:underline`}
                >
                  {video.owner?.username || 'Unknown user'}
                </Link>
                <div className="flex items-center text-xs mt-1 space-x-3 text-gray-500 dark:text-gray-400">
                  <span>{video.views || 0} views</span>
                  <span>
                    {video.createdAt
                      ? new Date(video.createdAt).toLocaleDateString()
                      : 'Unknown date'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {showRemove && onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(video._id);
              }}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-200'
              } shadow-md`}
            >
              <FiTrash2 className="text-red-500" size={16} />
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoGrid;