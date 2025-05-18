import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiVideo,
  FiUpload,
  FiCamera,
  FiImage,
  FiMoreHorizontal,
  FiEdit2,
  FiHeart,
  FiKey,
  FiMessageSquare,
} from "react-icons/fi";
import { fetchUserVideos, fetchUserByUsername } from "../api/videoService.js";
import { fetchLikedVideos } from "../api/likeService.js";
import { getUserTweets, createTweet } from "../api/tweetService.js";
import LoadingSpinner from "../components/LoadingSpinner";
import UpdateAvatar from "./UpdateAvatar";
import UpdateCoverImage from "./UpdateCoverImage";
import { subscribeToChannel } from "../api/subscriptionService";
import VideoGrid from "../components/VideoGrid.jsx";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const [profileUser, setProfileUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [isCreatingTweet, setIsCreatingTweet] = useState(false);
  const [tweetsLoading, setTweetsLoading] = useState(false);

  const isOwner =
    currentUser && profileUser && currentUser._id === profileUser._id;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);

        // Fetch user profile by username
        const userResponse = await fetchUserByUsername(username);
        setProfileUser(userResponse.data?.data);

        // Fetch user's videos
        const videosResponse = await fetchUserVideos(
          userResponse.data?.data?._id
        );
        setVideos(videosResponse.data?.data?.videos || []);

        if (currentUser && !isOwner) {
          setIsSubscribed(userResponse.data?.data?.isSubscribed);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [username, currentUser]);

  useEffect(() => {
    if (isOwner && activeTab === "liked") {
      const loadLikedVideos = async () => {
        try {
          setLoading(true);
          const response = await fetchLikedVideos();
          setLikedVideos(response.data?.data || []);
        } catch (err) {
          console.error("Error loading liked videos:", err);
        } finally {
          setLoading(false);
        }
      };

      loadLikedVideos();
    }
  }, [activeTab, isOwner]);

  useEffect(() => {
    if (isOwner && activeTab === "tweets") {
      const loadTweets = async () => {
        try {
          setTweetsLoading(true);
          const response = await getUserTweets(profileUser?._id);
          setTweets(response.data?.data?.tweets || []);
        } catch (err) {
          console.error("Error loading tweets:", err);
        } finally {
          setTweetsLoading(false);
        }
      };

      loadTweets();
    }
  }, [activeTab, isOwner, profileUser?._id]);

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return;

    try {
      setIsCreatingTweet(true);
      const response = await createTweet(newTweet);
      setTweets((prev) => [response.data.data, ...prev]);
      setNewTweet("");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error creating tweet:", error);
      toast.error(error?.response?.data?.message || "Error creating tweet");
    } finally {
      setIsCreatingTweet(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribeToChannel(profileUser?._id);

      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white inline-block`}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-72 w-full bg-gradient-to-r from-purple-500 to-blue-600">
        {profileUser?.coverImage && (
          <img
            src={profileUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative -mt-20">
              {profileUser?.avatar ? (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.fullName}
                  className="w-32 h-32 rounded-full border-4 object-cover"
                  style={{
                    borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  }}
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                  style={{
                    borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  }}
                >
                  <FiUser
                    size={48}
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {profileUser?.fullName}
              </h1>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                @{profileUser?.username}
              </p>

              {/* User stats */}
              <div className="flex space-x-4 mt-2 text-sm">
                <span>{videos.length} videos</span>
                <span>{profileUser?.subscribersCount || 0} subscribers</span>
                {!isOwner && (
                  <span>
                    Subscribed to {profileUser?.channelSubscribedToCount || 0}{" "}
                    channels
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 relative">
              {isOwner ? (
                <>
                  <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
                    <Link
                      to="/upload"
                      className={`flex items-center justify-center px-4 py-2 rounded-full ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white whitespace-nowrap`}
                    >
                      <FiUpload className="mr-2" />
                      <span className="text-sm sm:text-base">Upload Video</span>
                    </Link>

                    <Link
                      to="/videos-manage"
                      className={`flex items-center justify-center px-4 py-2 rounded-full ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white whitespace-nowrap`}
                    >
                      <FiEdit2 className="mr-2" />
                      <span className="text-sm sm:text-base">
                        Manage Videos
                      </span>
                    </Link>
                  </div>

                  <div className="sm:relative pt-3 sm:pt-0 text-center">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={`p-2 rounded-full ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                            theme === "dark" ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setIsAvatarModalOpen(true);
                                setShowDropdown(false);
                              }}
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                theme === "dark"
                                  ? "text-gray-200 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <FiCamera className="mr-2" />
                              Change Avatar
                            </button>
                            <button
                              onClick={() => {
                                setIsCoverModalOpen(true);
                                setShowDropdown(false);
                              }}
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                theme === "dark"
                                  ? "text-gray-200 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <FiImage className="mr-2" />
                              Change Cover
                            </button>
                            <Link
                              to="/profile/edit"
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                theme === "dark"
                                  ? "text-gray-200 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <FiEdit2 className="mr-2" />
                              Edit Profile
                            </Link>
                            <Link
                              to="/change-password"
                              className={`flex items-center w-full px-4 py-2 text-sm ${
                                theme === "dark"
                                  ? "text-gray-200 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <FiKey className="mr-2" />
                              Change Password
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSubscribe}
                  className={`flex items-center justify-center px-4 py-2 rounded-full ${
                    isSubscribed
                      ? theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                      : theme === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white whitespace-nowrap`}
                >
                  <FiHeart className="mr-2" />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="container mx-auto px-4 py-8">
        <div
          className={`mb-6 flex items-center justify-between ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("videos")}
              className={`text-xl font-bold flex items-center pb-2 border-b-2 whitespace-nowrap ${
                activeTab === "videos"
                  ? theme === "dark"
                    ? "border-blue-500 text-white"
                    : "border-blue-500 text-gray-900"
                  : theme === "dark"
                  ? "border-transparent text-gray-400"
                  : "border-transparent text-gray-500"
              }`}
            >
              <FiVideo className="mr-2" />
              {isOwner ? "Your Videos" : "Videos"}
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`text-xl font-bold flex items-center pb-2 border-b-2 whitespace-nowrap ${
                    activeTab === "liked"
                      ? theme === "dark"
                        ? "border-red-500 text-white"
                        : "border-red-500 text-gray-900"
                      : theme === "dark"
                      ? "border-transparent text-gray-400"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  <FiHeart className="mr-2" />
                  Liked Videos
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab("tweets")}
              className={`text-xl font-bold flex items-center pb-2 border-b-2 whitespace-nowrap ${
                activeTab === "tweets"
                  ? theme === "dark"
                    ? "border-green-500 text-white"
                    : "border-green-500 text-gray-900"
                  : theme === "dark"
                  ? "border-transparent text-gray-400"
                  : "border-transparent text-gray-500"
              }`}
            >
              <FiMessageSquare className="mr-2" />
              Tweets
            </button>
          </div>

          <span className="text-sm hidden sm:block">
            {activeTab === "videos"
              ? `${videos.length} ${videos.length === 1 ? "video" : "videos"}`
              : `${likedVideos.length} ${
                  likedVideos.length === 1 ? "video" : "videos"
                }`}
          </span>
        </div>

        {activeTab === "videos" ? (
          videos.length === 0 ? (
            <div
              className={`text-center py-12 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <FiVideo size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                {isOwner
                  ? "You haven't uploaded any videos yet"
                  : "No videos uploaded yet"}
              </h3>
              {isOwner && (
                <Link
                  to="/upload"
                  className={`mt-4 inline-block px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  Upload Your First Video
                </Link>
              )}
            </div>
          ) : (
            <VideoGrid videos={videos} theme={theme} />
          )
        ) : activeTab === "liked" ? (
          likedVideos.length === 0 ? (
            <div
              className={`text-center py-12 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <FiHeart size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                You haven't liked any videos yet
              </h3>
              <Link
                to="/"
                className={`mt-4 inline-block px-4 py-2 rounded-full ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Browse Videos
              </Link>
            </div>
          ) : (
            <VideoGrid
              videos={likedVideos.map((lv) => lv.video)}
              theme={theme}
            />
          )
        ) : null}
        {activeTab === "tweets" ? (
          <>
            {/* Tweet Creation */}
            {isOwner && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white border"
                }`}
              >
                <textarea
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-green-500/30"
                      : "bg-white border-gray-300 focus:border-green-400 focus:ring-green-400/30"
                  }`}
                  rows="3"
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  placeholder="What's on your mind?"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCreateTweet}
                    disabled={isCreatingTweet || !newTweet.trim()}
                    className={`px-4 py-2 rounded-full ${
                      isCreatingTweet || !newTweet.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                      theme === "dark"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    {isCreatingTweet ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      "Tweet"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tweets List */}
            {tweetsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="sm" />
              </div>
            ) : tweets.length === 0 ? (
              <div
                className={`text-center py-12 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <FiMessageSquare size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  {isOwner ? "You haven't tweeted yet" : "No tweets yet"}
                </h3>
                {isOwner && (
                  <button
                    onClick={() => setActiveTab("tweets")}
                    className={`mt-4 inline-block px-4 py-2 rounded-full ${
                      theme === "dark"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    Create Your First Tweet
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <div
                    key={tweet._id}
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-white border"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {profileUser?.avatar ? (
                        <img
                          src={profileUser.avatar}
                          alt={profileUser.fullName}
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
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {profileUser?.fullName || "You"}
                            </span>
                            <span
                              className={`text-xs ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              @{profileUser?.username}
                            </span>
                          </div>
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
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
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Modals */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <UpdateAvatar onClose={() => setIsAvatarModalOpen(false)} />
        </div>
      )}

      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <UpdateCoverImage onClose={() => setIsCoverModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
