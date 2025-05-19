import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiUser,  FiClock } from 'react-icons/fi';
import {userSubscribedChannels as  getSubscriptions } from '../api/subscriptionService';
import LoadingSpinner from '../components/LoadingSpinner';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptions(currentPage);
        
        setSubscriptions(response.data?.data?.subscribedChannels);
        setTotalPages(response.data.data?.totalPages);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSubscriptions();
  }, [currentPage, user]);

  if (loading) {
    return <LoadingSpinner size="xl" />;
  }

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50 text-gray-700'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Subscriptions ({subscriptions.length})</h1>
        
        {subscriptions.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}>
            <FiUser size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium">No subscriptions yet</h3>
            <p className="mt-2">Find channels to subscribe to</p>
            <Link
              to="/channels"
              className={`mt-4 inline-block px-4 py-2 rounded-full ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Browse Channels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription._id}
                className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <Link
                    to={`/profile/${subscription.channel.username}`}
                    className="flex-shrink-0"
                  >
                    {subscription.channel.avatar ? (
                      <img
                        src={subscription.channel.avatar}
                        alt={subscription.channel.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${subscription.channel.username}`}
                        className="font-medium hover:underline"
                      >
                        {subscription.channel.fullName}
                      </Link>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Subscribed on {new Date(subscription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {subscription.recentVideo && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/videos/${subscription.recentVideo._id}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={subscription.recentVideo.thumbnail}
                              alt={subscription.recentVideo.title}
                              className="w-24 h-16 rounded-lg object-cover"
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/videos/${subscription.recentVideo._id}`}
                              className="font-medium hover:underline line-clamp-1"
                            >
                              {subscription.recentVideo.title}
                            </Link>
                            <div className={`flex items-center text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <FiClock className="mr-1" />
                              {new Date(subscription.recentVideo.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? theme === 'dark' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage