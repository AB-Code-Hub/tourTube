import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAllVideos } from "../api/videoService";
import { useTheme } from "../contexts/ThemeContext";
import { FiUser, FiSearch, FiFilter, FiX, FiMessageSquare, FiHeart } from "react-icons/fi";
import { getTweets } from "../api/tweetService";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [tweets, setTweets] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sortBy: "createdAt",
    sortType: "desc",
    page: 1,
    limit: 12,
  });
  const [showFilters, setShowFilters] = useState(false);
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        query: searchQuery,
      };
      const response = await fetchAllVideos(params);
      setVideos(response.data?.data?.videos || []);
      setChannels(response.data?.data?.channels || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   const fetchTweets = async () => {
    try {
      setTweetsLoading(true);
      const response = await getTweets();
      setTweets(response.data?.data?.tweets || []);
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    } finally {
      setTweetsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVideos();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

   useEffect(() => {
    fetchTweets(); 
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      sortBy: "createdAt",
      sortType: "desc",
      page: 1,
      limit: 12,
    });
    setSearchQuery("");
  };

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
      {/* Search and Filter Section */}
      <div
        className={`sticky top-0 z-10 py-4 px-4 ${
          theme === "dark" ? "bg-gray-900/80" : "bg-gray-50/80"
        } backdrop-blur-md`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <FiSearch />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search videos by title or description..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                    : "bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400/30"
                }`}
              />
            </div>

            {/* Filter Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                } border ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <FiFilter />
                <span>Filters</span>
              </button>
              {(searchQuery ||
                filters.sortBy !== "createdAt" ||
                filters.sortType !== "desc") && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-100"
                  } border ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <FiX />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className={`w-full p-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-400"
                    }`}
                  >
                    <option value="createdAt">Upload Date</option>
                    <option value="views">Views</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block mb-2 font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Sort Order
                  </label>
                  <select
                    name="sortType"
                    value={filters.sortType}
                    onChange={handleFilterChange}
                    className={`w-full p-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-400"
                    }`}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="h-64">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <>

              {/* Tweet Section */}

                <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold flex items-center ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}>
                  <FiMessageSquare className="mr-2" />
                  Recent Tweets
                </h2>
                <Link
                  to="/manage-tweets"
                  className={`px-3 py-1 text-sm rounded-full ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  Create Tweet
                </Link>
              </div>

              {tweetsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : tweets.length === 0 ? (
                <div className={`text-center py-8 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  <FiMessageSquare size={32} className="mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No tweets yet</h3>
                  <p>Be the first to tweet!</p>
                </div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {tweets.slice(0, 4).map((tweet) => (
                    <motion.div
                      key={tweet._id}
                      variants={item}
                      className={`p-4 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-800"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {tweet.owner?.avatar ? (
                          <img
                            src={tweet.owner.avatar}
                            alt={tweet.owner.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                          }`}>
                            <FiUser className={
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            } />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {tweet.owner?.fullName || "User"}
                              </span>
                              <span className={`text-xs ${
                                theme === "dark" ? "text-gray-400" : "text-gray-500"
                              }`}>
                                @{tweet.owner?.username}
                              </span>
                            </div>
                            <span className={`text-xs ${
                              theme === "dark" ? "text-gray-500" : "text-gray-400"
                            }`}>
                              {new Date(tweet.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-line">
                            {tweet.content}
                          </p>
                          <div className="flex items-center mt-3 space-x-4">
                            <button
                              className={`flex items-center space-x-1 ${
                                tweet.isLiked
                                  ? "text-red-500"
                                  : theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              <FiHeart
                                className={tweet.isLiked ? "fill-current" : ""}
                                size={16}
                              />
                              <span className="text-sm">
                                {tweet.likesCount || 0}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {tweets.length > 4 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/tweets"
                    className={`text-sm ${
                      theme === "dark" ? "text-blue-400" : "text-blue-500"
                    } hover:underline`}
                  >
                    View all tweets
                  </Link>
                </div>
              )}
            </div>

            {/* Channels Section */}
            {channels.length > 0 && (
              <div className="mb-8">
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Channels
                </h2>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                  {channels.map((channel) => (
                    <Link key={channel._id} to={`/profile/${channel.username}`}>
                      <motion.div
                        variants={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-lg transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gray-800 hover:bg-gray-750"
                            : "bg-white hover:bg-gray-50"
                        } shadow-md`}
                      >
                        <div className="flex flex-col items-center text-center">
                          {channel.avatar ? (
                            <img
                              src={channel.avatar}
                              alt={channel.username}
                              className="w-20 h-20 rounded-full object-cover mb-3"
                            />
                          ) : (
                            <div
                              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              <FiUser
                                size={40}
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              />
                            </div>
                          )}
                          <h3 className="font-semibold text-sm">
                            {channel.fullName}
                          </h3>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            @{channel.username}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {channel.subscribersCount} subscribers
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length === 0 && channels.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">
                  {searchQuery
                    ? "No videos match your search"
                    : "No videos found"}
                </h3>
                <p className="mt-2 opacity-80">
                  {searchQuery
                    ? "Try different keywords"
                    : "Upload your first video to get started"}
                </p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {videos.map((video) => (
                  <Link key={video._id} to={`/videos/${video._id}`}>
                    <motion.div
                      variants={item}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-750"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div
                        className={`relative aspect-video ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {video.videoFile ? (
                          <video
                            className="w-full h-full object-cover"
                            poster={video.thumbnail}
                            src={video.videoFile}
                            muted
                            loop
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {video.duration || "0:00"}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          {video.owner?.avatar ? (
                            <img
                              src={video.owner.avatar}
                              alt={video.owner.username}
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
                              {video.title}
                            </h3>
                            <p className="text-xs opacity-80 truncate">
                              {video.owner?.username || "Unknown user"}
                            </p>
                            <div className="flex items-center text-xs mt-1 space-x-3 text-gray-500 dark:text-gray-400">
                              <span>{video.views || 0} views</span>
                              <span>
                                {video.createdAt
                                  ? new Date(
                                      video.createdAt
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
