import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
    console.log(video);
    
  return (
    <Link to={`/videos/${video._id}`} className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition">
      <img src={video?.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{video.description?.slice(0, 60)}...</p>
      </div>
    </Link>
  );
}
