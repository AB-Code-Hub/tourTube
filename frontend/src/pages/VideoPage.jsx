import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVideoById, likeVideo } from "../api/videoService";
import { fetchComments, postComment } from "../api/commentService";
import { useTheme } from "../contexts/ThemeContext";
import { FiThumbsUp, FiUser, FiSend, FiLoader } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [videoRes, commentsRes] = await Promise.all([
          fetchVideoById(id),
          fetchComments(id)
        ]);
        setVideo(videoRes?.data?.data);
        setComments(commentsRes?.data?.data?.comments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      await likeVideo(id);
      const updated = await fetchVideoById(id);
      setVideo(updated.data.data);
    } finally {
      setLikeLoading(false);
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

  if (loading) {
   return <LoadingSpinner />
  }

  if (!video) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Video Not Found</h2>
          <p className="mb-4">The requested video could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Video Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{video.title}</h1>
          
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <video 
              src={video.videoFile} 
              controls 
              className="w-full h-full object-contain"
              poster={video.thumbnail}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {video.owner?.avatar ? (
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                )}
                <span className="font-medium">{video.owner?.username || 'Unknown user'}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors`}
            >
              {likeLoading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <>
                  <FiThumbsUp />
                  <span>{video.likesCount || 0}</span>
                </>
              )}
            </motion.button>
          </div>

          {video.description && (
            <div className={`mt-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <p className="whitespace-pre-line">{video.description}</p>
            </div>
          )}
        </motion.section>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className={`flex items-start space-x-3 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <textarea
                className={`flex-1 min-h-[80px] p-2 rounded focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                }`}
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className={`p-2 rounded-full ${
                  commentLoading || !newComment.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-opacity-90'
                } ${
                  theme === 'dark' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                }`}
              >
                {commentLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                No comments yet. Be the first to comment!
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
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {comment.user?.avatar ? (
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
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
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{comment.user?.name || 'User'}</span>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-line">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}