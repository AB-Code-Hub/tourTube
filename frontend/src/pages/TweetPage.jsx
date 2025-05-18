import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiSend, 
  FiLoader, 
  FiHeart, 
  FiTrash2, 
  FiEdit2,
  FiMessageSquare,
  FiMoreHorizontal
} from 'react-icons/fi';
import { 
  createTweet, 
  getTweets, 
  updateTweet, 
  deleteTweet,
} from '../api/tweetService.js';
import { likeTweet } from '../api/likeService.js';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { toast } from 'react-toastify';

const TweetPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tweetToDelete, setTweetToDelete] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await getTweets(user?._id);
        setTweets(response.data?.data?.tweets || []);
      } catch (error) {
        console.error('Error fetching tweets:', error);
        toast.error(error?.response?.data?.message || 'Error loading tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await createTweet(content);
      
      setTweets(prev => [response.data.data, ...prev]);
      setContent('');
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error creating tweet:', error);
      toast.error(error?.response?.data?.message || 'Error creating tweet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (tweetId) => {
    if (!editedContent.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await updateTweet(tweetId, editedContent);
      setTweets(prev => 
        prev.map(tweet => 
          tweet._id === tweetId ? response.data.data : tweet
        )
      );
      setEditingTweetId(null);
      setEditedContent('');
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error updating tweet:', error);
      toast.error(error?.response?.data?.message || 'Error updating tweet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTweet(tweetToDelete);
      setTweets(prev => prev.filter(tweet => tweet._id !== tweetToDelete));
      setShowDeleteModal(false);
      toast.success('Tweet deleted successfully');
    } catch (error) {
      console.error('Error deleting tweet:', error);
      toast.error(error?.response?.data?.message || 'Error deleting tweet');
    }
  };

  const handleLike = async (tweetId) => {
    try {
      const response = await likeTweet(tweetId);
      setTweets(prev => 
        prev.map(tweet => 
          tweet._id === tweetId 
            ? { 
                ...tweet, 
                isLiked: response.data.data.isLiked,
                likesCount: response.data.data?.likeCount 
              } 
            : tweet
        )
      );
    } catch (error) {
      console.error('Error liking tweet:', error);
      toast.error(error?.response?.data?.message || 'Error liking tweet');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Tweet Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-8 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-start space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30'
                      : 'bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400/30'
                  }`}
                  rows="3"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                />
                <div className="flex justify-end mt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className={`px-4 py-2 rounded-full ${
                      isSubmitting || !content.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiSend className="inline mr-1" /> Tweet
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.section>

        {/* Tweets List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`mb-4 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <FiMessageSquare className="mr-2" />
            <h2 className="text-xl font-semibold">Recent Tweets</h2>
          </div>

          <AnimatePresence>
            {tweets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-8 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <FiMessageSquare size={32} className="mx-auto mb-3" />
                <h3 className="text-lg font-medium">No tweets yet</h3>
                <p>Be the first to tweet!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <motion.div
                    key={tweet._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
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
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {tweet.owner?.fullName || 'User'}
                            </span>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              @{tweet.owner?.username}
                            </span>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              • {new Date(tweet.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {user?._id === tweet.owner?._id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingTweetId(tweet._id);
                                  setEditedContent(tweet.content);
                                }}
                                className={`p-1 rounded-full ${
                                  theme === 'dark'
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-200'
                                }`}
                              >
                                <FiEdit2 size={14} className="text-blue-500" />
                              </button>
                              <button
                                onClick={() => {
                                  setTweetToDelete(tweet._id);
                                  setShowDeleteModal(true);
                                }}
                                className={`p-1 rounded-full ${
                                  theme === 'dark'
                                    ? 'hover:bg-gray-700'
                                    : 'hover:bg-gray-200'
                                }`}
                              >
                                <FiTrash2 size={14} className="text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>

                        {editingTweetId === tweet._id ? (
                          <div className="mt-2">
                            <textarea
                              className={`w-full p-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              rows="3"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => setEditingTweetId(null)}
                                className={`px-3 py-1 rounded-lg ${
                                  theme === 'dark'
                                    ? 'bg-gray-600 hover:bg-gray-500'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdate(tweet._id)}
                                disabled={!editedContent.trim()}
                                className={`px-3 py-1 rounded-lg ${
                                  !editedContent.trim()
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                } text-white`}
                              >
                                {isSubmitting ? (
                                  <FiLoader className="animate-spin" />
                                ) : (
                                  'Update'
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mt-1 whitespace-pre-line">
                              {tweet.content}
                            </p>
                            <div className="flex items-center mt-3 space-x-4">
                              <button
                                onClick={() => handleLike(tweet._id)}
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
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Tweet"
        message="Are you sure you want to delete this tweet?"
        theme={theme}
      />
    </div>
  );
};

export default TweetPage;