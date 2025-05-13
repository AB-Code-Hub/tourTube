import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVideoById, likeVideo } from "../api/videoService";
import { fetchComments, postComment } from "../api/commentService";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchVideoById(id).then(res => setVideo(res?.data?.data)),
      fetchComments(id).then(res => setComments(res?.data?.data?.comments))
    ])
    .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    await likeVideo(id);
    const updated = await fetchVideoById(id);
    setVideo(updated.data.video);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await postComment(id, newComment);
    setNewComment("");
    const updatedComments = await fetchComments(id);
    setComments(updatedComments.data.comments);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!video) return <div className="p-4">Video not found</div>;
  console.log("video ===",video);
  console.log(comments);
  
  
  

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
      <video src={video.videoFile} controls className="w-full mb-4 rounded" />
      <p className="mb-4 text-gray-700">{video.description}</p>

      <button onClick={handleLike} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        👍 Like ({video.likesCount})
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Post
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="mb-2 p-2 border-b">
              <p className="text-sm text-gray-800">{c.content}</p>
              <p className="text-xs text-gray-500">By {c.user?.name || 'User'} on {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
