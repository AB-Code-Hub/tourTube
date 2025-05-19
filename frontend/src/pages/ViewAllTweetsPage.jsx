import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiHeart, 
  FiMessageSquare,
  FiArrowLeft,
  FiRepeat,
  FiShare2,
  FiMessageCircle
} from 'react-icons/fi';
import { getTweets } from '../api/tweetService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const ViewAllTweetsPage = () => {
  const { user } = useAuth();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Tweets</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded-full font-bold ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <div className={`container mx-auto px-0 max-w-2xl border-x ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-4 border-b ${
          theme === 'dark' ? 'border-gray-800 bg-black/80' : 'border-gray-200 bg-white/80'
        } backdrop-blur-sm flex items-center`}>
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-200/10 mr-6"
          >
            <FiArrowLeft className="text-lg" />
          </Link>
          <h1 className="text-xl font-bold">All Tweets</h1>
        </div>

        {/* Tweets List */}
        <AnimatePresence>
          {tweets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <FiMessageSquare size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium">No tweets yet</h3>
              <p>Be the first to tweet!</p>
            </motion.div>
          ) : (
            <div>
              {tweets.map((tweet) => (
                <motion.div
                  key={tweet._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 border-b ${
                    theme === 'dark' ? 'border-gray-800 hover:bg-gray-900/50' : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <Link to={`/profile/${tweet?.owner?.username}`}>
                        {tweet.owner?.avatar ? (
                          <img
                            src={tweet.owner.avatar}
                            alt={tweet.owner.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                          }`}>
                            <FiUser className={
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            } size={20} />
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <Link to={`/profile/${tweet?.owner?.username}`} className="font-bold hover:underline">
                          {tweet.owner?.fullName || 'User'}
                        </Link>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          @{tweet.owner?.username}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {formatDate(tweet.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-lg whitespace-pre-line">
                        {tweet.content}
                      </p>
                      <div className="flex justify-between mt-3 max-w-md">
                       
                        <button
                          className={`flex items-center space-x-1 p-2 rounded-full ${
                            theme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-100'
                          }`}
                        >
                          <FiHeart
                            className={
                              tweet.isLiked 
                                ? 'fill-current text-red-500' 
                                : theme === 'dark' 
                                  ? 'text-gray-500' 
                                  : 'text-gray-400'
                            }
                            size={18}
                          />
                          <span className={`text-sm ${
                            tweet.isLiked 
                              ? 'text-red-500' 
                              : theme === 'dark' 
                                ? 'text-gray-500' 
                                : 'text-gray-400'
                          }`}>
                            {tweet.likesCount || 0}
                          </span>
                        </button>
                      
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViewAllTweetsPage;