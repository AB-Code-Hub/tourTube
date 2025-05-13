import { useEffect, useState } from "react";
import { fetchAllVideos } from "../api/videoService";
import VideoCard from "../components/VideoCard";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllVideos();
        
        setVideos(response.data?.data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">All Videos</h1>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
            
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-4">No videos found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
