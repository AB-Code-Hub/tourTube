import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiList } from 'react-icons/fi';
import { getUserPlaylists } from '../api/playlistService';
import LoadingSpinner from '../components/LoadingSpinner';

const UserPlaylists = ({ userId, isOwner = false }) => {
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getUserPlaylists(userId);
        
        setPlaylists(response.data?.playlists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Error loading playlists
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className={`text-lg font-semibold mb-4 flex items-center ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      }`}>
        <FiList className="mr-2" />
        {isOwner ? 'Your Playlists' : 'Playlists'}
      </h3>
      
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.slice(0, 3).map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlists/${playlist._id}`}
              className={`p-3 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-md mr-3 flex-shrink-0 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                } flex items-center justify-center`}>
                  <FiList className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium truncate">{playlist.title}</h4>
                  <p className={`text-sm truncate ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {playlist.videos?.length || 0} videos
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`text-center py-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {isOwner ? 'You have no playlists yet' : 'No playlists available'}
        </div>
      )}

      {playlists.length > 3 && (
        <div className="mt-4 text-center">
          <Link
            to={`/profile/${userId}/playlists`}
            className={`text-sm ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            } hover:underline`}
          >
            View all playlists
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;