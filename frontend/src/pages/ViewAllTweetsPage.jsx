import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiHeart, 
  FiMessageSquare,
  FiArrowLeft
} from 'react-icons/fi';
import { getTweets } from '../api/tweetService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ViewAllTweetsPage = () => {
  const { theme } = useTheme();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await getTweets();
        setTweets(response.data?.data?.tweets || []);
      } catch (err) {
        console.error('Error fetching tweets:', err);
        setError(err.message);
        toast.error(err?.response?.data?.message || 'Error loading tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
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
          <h2 className="text-xl font-bold mb-2">Error Loading Tweets</h2>
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className={`flex items-center px-3 py-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            }`}
          >
            <FiArrowLeft className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            <FiMessageSquare className="mr-2" />
            All Tweets
          </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Tweets List */}
        <AnimatePresence>
          {tweets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <FiMessageSquare size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium">No tweets yet</h3>
              <p>Be the first to tweet!</p>
            </motion.div>
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
              className="space-y-4"
            >
              {tweets.map((tweet) => (
                <motion.div
                  key={tweet._id}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    show: { y: 0, opacity: 1 },
                  }}
                  className={`p-4 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800'
                      : 'bg-white border border-gray-200'
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
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <FiUser className={
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        } />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link to={`/profile/${tweet?.owner?.username}`} className="flex items-center space-x-2">
                          <span className="font-medium">
                            {tweet.owner?.fullName || "User"}
                          </span>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            @{tweet.owner?.username}
                          </span>
                        </Link>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
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
                              ? 'text-red-500'
                              : theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                          <FiHeart
                            className={tweet.isLiked ? 'fill-current' : ''}
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViewAllTweetsPage;