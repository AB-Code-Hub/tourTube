import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVideoById } from "../api/videoService";
import {
  fetchComments,
  postComment,
  deleteComment,
  updateComment,
} from "../api/commentService";
import { likeComment, likeVideo } from "../api/likeService.js";
import {
  getUserPlaylists,
  addVideoToPlaylist,
} from "../api/playlistService.js";
import {
  subscribeToChannel,
  checkSubscription,
} from "../api/subscriptionService";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  FiUser,
  FiSend,
  FiLoader,
  FiClock,
  FiEye,
  FiCalendar,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiMoreHorizontal,
  FiTrash2,
  FiEdit2,
  FiEdit,
  FiVideo,
  FiPlus,
  FiList,
  FiX,
} from "react-icons/fi";
import {
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
  FaShareAlt,
  FaClipboard,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import VideoRecommendations from "../components/VideoRecommendations";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function VideoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoRes = await fetchVideoById(id);

        if (videoRes?.data?.data) {
          setVideo(videoRes.data.data);
          setIsLiked(videoRes?.data?.data?.isLiked);
          if (user && videoRes.data.data.owner?._id) {
            const subRes = await checkSubscription(
              videoRes.data.data.owner._id
            );
            setIsSubscribed(subRes?.data?.data?.isSubscribed || false);
            setSubscribersCount(subRes?.data?.data?.totalSubscribers);
          }

          // Fetch comments after video data is loaded
          // In your useEffect where you fetch comments
          const commentsRes = await fetchComments(id);
          setComments(
            commentsRes?.data?.data?.comments?.map((comment) => ({
              ...comment,
              isLiked: comment.isLiked || false,
              likeCount: comment.likesCount || 0,
            })) || []
          );
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error(error?.response?.data?.message || "Error loading video");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id, user]);

  const fetchUserPlaylists = async () => {
  try {
    setPlaylistsLoading(true);
    const response = await getUserPlaylists(user?._id);
    setPlaylists(response.data?.playlists || []);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    toast.error(error?.response?.data?.message || "Error loading playlists");
  } finally {
    setPlaylistsLoading(false);
  }
};

const handleAddToPlaylist = async (playlistId) => {
  try {
    const response = await addVideoToPlaylist(playlistId, id); 
    toast.success("Video added to playlist successfully");
    setShowPlaylistModal(false);
  } catch (error) {
    console.error("Error adding to playlist:", error);
    toast.error(error?.response?.data?.message || "Error adding to playlist");
  }
};

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const res = await likeVideo(id);
      setIsLiked(res.data?.data?.isLiked);
      setVideo((prev) => ({
        ...prev,
        likesCount: res.data?.data?.likeCount,
      }));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const res = await likeComment(commentId);
      if (res) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likeCount: res.data.data.likeCount,
                isLiked: res.data.data.isLiked,
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error(error?.response?.data?.message || "Failed to like comment");
    }
  };
  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await subscribeToChannel(video?.owner._id);
      const channelData = response?.data?.data;
      if (channelData) {
        setIsSubscribed(channelData.isSubscribed);
        setSubscribersCount(channelData.subscribersCount);
        setVideo((prev) => ({
          ...prev,
          owner: {
            ...prev.owner,
            subscribers: channelData.subscribersCount,
          },
        }));
        toast.success(
          channelData.isSubscribed
            ? "Subscribed successfully"
            : "Unsubscribed successfully"
        );
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update subscription"
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      await postComment(id, newComment);
      setNewComment("");
      const updatedComments = await fetchComments(id);
      setComments(updatedComments.data.data?.comments || []);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      setCommentLoading(true);
      await updateComment(commentId, editedComment);
      const updatedComments = await fetchComments(id);
      setComments(updatedComments.data.data?.comments || []);
      setEditingCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!video) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Video Not Found</h2>
          <p className="mb-4">The requested video could not be loaded.</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white inline-block`}
          >
            Browse Videos
          </Link>
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
      <div className="container mx-auto px-4 py-6 lg:flex lg:space-x-6">
        {/* Main Video Content */}
        <main className="lg:w-2/3">
          {/* Video Player */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                src={video.videoFile}
                controls
                className="w-full h-full object-contain"
                poster={video.thumbnail}
              />
            </div>
          </motion.section>

          {/* Video Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h1
              className={`text-2xl font-bold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {video.title}
            </h1>

            {/* Video Stats */}
            <div
              className={`flex flex-wrap items-center justify-between mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FiEye className="mr-1" /> {video.views || 0} views
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1" /> {video.duration || "0:00"}
                </span>
                <span className="flex items-center">
                  <FiCalendar className="mr-1" />
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                {/* Like Button (existing) */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {likeLoading ? (
                    <FiLoader className="animate-spin" size={16} />
                  ) : (
                    <>
                      <FiHeart className={isLiked ? "fill-current" : ""} />
                      <span>{video.likesCount || 0}</span>
                    </>
                  )}
                </motion.button>

                {/* Share Button */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <FiShare2 size={18} />
                  </motion.button>

                  {/* Share Options Dropdown */}
                  {showShareOptions && (
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
                            navigator.clipboard.writeText(window.location.href);
                            setShowShareOptions(false);
                            toast.success("Link copied successfully");
                          }}
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            theme === "dark"
                              ? "text-gray-200 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <FaClipboard className="text-gray-200" />
                          Copy Link
                        </button>
                        <>
                          {/* X */}
                          <button
                            onClick={() => {
                              window.open(
                                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                  window.location.href
                                )}`,
                                "_blank"
                              );
                              setShowShareOptions(false);
                            }}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <FaTwitter className="text-blue-500" />
                            Share on X
                          </button>

                          {/* WhatsApp */}
                          <button
                            onClick={() => {
                              const url = encodeURIComponent(
                                window.location.href
                              );
                              window.open(
                                `https://wa.me/?text=${url}`,
                                "_blank"
                              );
                              setShowShareOptions(false);
                            }}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <FaWhatsapp className="text-green-500" />
                            Share on WhatsApp
                          </button>

                          {/* Instagram (fallback) */}
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator
                                  .share({
                                    title: document.title,
                                    url: window.location.href,
                                  })
                                  .catch((err) =>
                                    console.error("Share failed:", err)
                                  );
                              } else {
                                navigator.clipboard.writeText(
                                  window.location.href
                                );
                                alert(
                                  "Link copied! Open Instagram and paste it in your story or bio."
                                );
                              }
                              setShowShareOptions(false);
                            }}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <FaInstagram className="text-pink-500" />
                            Share on Instagram
                          </button>

                          {/* Generic Share via... */}
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator
                                  .share({
                                    title: document.title,
                                    text: "Check this out!",
                                    url: window.location.href,
                                  })
                                  .catch((err) =>
                                    console.error("Web Share API failed:", err)
                                  );
                              } else {
                                alert(
                                  "Sharing is not supported on this device."
                                );
                              }
                              setShowShareOptions(false);
                            }}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <FaShareAlt className="text-gray-500" />
                            Share via…
                          </button>
                            

                        </>
                      </div>
                    </motion.div>
                  )}
                </div>

{user && (
  <button
    onClick={() => {
      if (!user) {
        toast.error("Please login to add to playlists");
        return;
      }
      fetchUserPlaylists();
      setShowPlaylistModal(true);
    }}
    className={`flex items-center space-x-1 p-2 rounded-full ${
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
    }`}
  >
    <FiPlus size={18} />
    <span className="text-sm">Add to Playlist</span>
  </button>
)}

                {/* More Options Button */}
                {user?._id === video.owner?._id && (
                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className={`p-2 rounded-full ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      <FiMoreHorizontal size={18} />
                    </motion.button>

                    {/* More Options Dropdown */}
                    {showMoreOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <div className="py-1">
                          <Link
                            to={`/edit-video/${video._id}`}
                            className={`items-center flex  px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setShowMoreOptions(false)}
                          >
                            <FiEdit className="mr-2" />
                            Edit Video
                          </Link>

                          <Link
                            to={`/videos-manage`}
                            className={`items-center flex px-4 py-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setShowMoreOptions(false)}
                          >
                            <FiVideo className="mr-2" />
                            Manage Video
                          </Link>



                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Channel Info */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Link
                to={`/profile/${video.owner?.username}`}
                className="flex items-center space-x-3"
              >
                {video.owner?.avatar ? (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <FiUser
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                      size={20}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">
                    {video.owner?.username || "Unknown user"}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {subscribersCount || 0} subscribers
                  </p>
                </div>
              </Link>
              {user && (
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className={`px-4 py-2 rounded-full ${
                    isSubscribed
                      ? theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                      : theme === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {isSubscribing ? (
                    <span className="flex items-center">
                      <FiLoader className="animate-spin mr-2" />
                      {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
                    </span>
                  ) : isSubscribed ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              )}
            </div>

            {/* Video Description */}
            {video.description && (
              <div
                className={`mt-4 p-4 rounded-lg whitespace-pre-line ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Description
                </h3>
                <p>{video.description}</p>
              </div>
            )}
          </motion.section>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className={`flex items-center justify-between mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <h2 className="text-xl font-semibold flex items-center">
                <FiMessageSquare className="mr-2" />
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex items-start space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
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
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    />
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500/30"
                        : "bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400/30"
                    }`}
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className={`px-4 py-2 rounded-full ${
                        commentLoading || !newComment.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } ${
                        theme === "dark"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {commentLoading ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <>
                          <FiSend className="inline mr-1" /> Comment
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <AnimatePresence>
              {comments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FiMessageSquare size={32} className="mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No comments yet</h3>
                  <p>Be the first to comment</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-lg ${
                        theme === "dark"
                          ? "bg-gray-800"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {comment.owner?.avatar ? (
                          <img
                            src={comment.owner.avatar}
                            alt={comment.owner.fullName}
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
                                {comment.owner?.fullName || "User"}
                              </span>
                              <span
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {user?._id === comment.owner?._id && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditedComment(comment.content);
                                  }}
                                  className={`p-1 rounded-full ${
                                    theme === "dark"
                                      ? "hover:bg-gray-700"
                                      : "hover:bg-gray-200"
                                  }`}
                                >
                                  <FiEdit2
                                    size={14}
                                    className="text-blue-500"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setCommentToDelete(comment._id);
                                    setShowDeleteModal(true);
                                  }}
                                  className={`p-1 rounded-full ${
                                    theme === "dark"
                                      ? "hover:bg-gray-700"
                                      : "hover:bg-gray-200"
                                  }`}
                                >
                                  <FiTrash2
                                    size={14}
                                    className="text-red-500"
                                  />
                                </button>
                              </div>
                            )}
                          </div>

                          {editingCommentId === comment._id ? (
                            <div className="mt-2">
                              <textarea
                                className={`w-full p-2 rounded-lg border ${
                                  theme === "dark"
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                                value={editedComment}
                                onChange={(e) =>
                                  setEditedComment(e.target.value)
                                }
                                rows="3"
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className={`px-3 py-1 rounded-lg ${
                                    theme === "dark"
                                      ? "bg-gray-600 hover:bg-gray-500"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateComment(comment._id)
                                  }
                                  disabled={!editedComment.trim()}
                                  className={`px-3 py-1 rounded-lg ${
                                    !editedComment.trim()
                                      ? "bg-blue-400 cursor-not-allowed"
                                      : "bg-blue-500 hover:bg-blue-600"
                                  } text-white`}
                                >
                                  {commentLoading ? (
                                    <FiLoader className="animate-spin" />
                                  ) : (
                                    "Update"
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="mt-1 whitespace-pre-line">
                                {comment.content}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <button
                                  onClick={() => handleCommentLike(comment._id)}
                                  className={`flex items-center space-x-1 ${
                                    comment.isLiked
                                      ? "text-red-500"
                                      : theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  <FiHeart
                                    className={
                                      comment.isLiked ? "fill-current" : ""
                                    }
                                    size={16}
                                  />
                                  <span className="text-sm">
                                    {comment.likeCount || 0}
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
        </main>

        {/* Sidebar - Recommended Videos */}
        <aside className="lg:w-1/3 mt-8 lg:mt-0">
          <VideoRecommendations currentVideoId={id} />
        </aside>
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        theme={theme}
      />

              {showPlaylistModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className={`w-full max-w-md rounded-lg p-6 ${
      theme === "dark" ? "bg-gray-800" : "bg-white"
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add to Playlist</h2>
        <button
          onClick={() => setShowPlaylistModal(false)}
          className={`p-1 rounded-full ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
        >
          <FiX />
        </button>
      </div>
      
      {playlistsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : playlists.length === 0 ? (
        <div className={`text-center py-6 rounded-lg ${
          theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}>
          <FiList size={32} className="mx-auto mb-3" />
          <h3 className="text-lg font-medium">No playlists found</h3>
          <p>Create a playlist first</p>
          <Link
            to="/playlists"
            className={`mt-4 inline-block px-4 py-2 rounded-full ${
              theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Create Playlist
          </Link>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {playlists?.map((playlist) => (
            <div
              key={playlist._id}
              className={`p-3 rounded-lg mb-2 flex justify-between items-center ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <div>
                <h3 className="font-medium">{playlist.name}</h3>
                <p className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  {playlist.videos?.length || 0} videos
                </p>
              </div>
              <button
                onClick={() => handleAddToPlaylist(playlist._id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === "dark" 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
