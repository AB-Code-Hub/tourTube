import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiPlus, 
  FiTrash2, 
  FiEdit2,
  FiList,
  FiVideo,
  FiX,
  FiChevronLeft
} from 'react-icons/fi';
import { 
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
} from '../api/playlistService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { toast } from 'react-toastify';
import VideoGrid from '../components/VideoGrid';

const PlaylistPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { playlistId } = useParams();
  const navigate = useNavigate();
  
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [videoToRemove, setVideoToRemove] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistData, setNewPlaylistData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (playlistId) {
          const response = await getPlaylistById(playlistId);
          setCurrentPlaylist(response.data);
        } else {
          const response = await getUserPlaylists(user._id);
        setPlaylists(response.data?.playlists);
        }
      } catch (err) {
        setError(err.message);
        toast.error(err?.response?.data?.message || 'Error loading playlists');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, playlistId]);

  const handleCreatePlaylist = async () => {
    try {
      setLoading(true);
      const response = await createPlaylist(newPlaylistData);
      
      setPlaylists(prev => [...prev, response.data]);
      setShowCreateForm(false);
      setNewPlaylistData({
        name: '',
        description: '',
      });
      toast.success('Playlist created successfully');
    } catch (err) {
      console.error('Error creating playlist:', err);
      toast.error(err?.response?.data?.message || 'Error creating playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      setLoading(true);
      const response = await updatePlaylist(playlistId, editData);
      setCurrentPlaylist(response.data);
      setIsEditing(false);
      toast.success('Playlist updated successfully');
    } catch (err) {
      console.error('Error updating playlist:', err);
      toast.error(err?.response?.data?.message || 'Error updating playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlistToDelete);
      if (playlistId) {
        navigate('/playlists');
      } else {
        setPlaylists(prev => prev.filter(p => p._id !== playlistToDelete));
      }
      setShowDeleteModal(false);
      toast.success('Playlist deleted successfully');
    } catch (err) {
      console.error('Error deleting playlist:', err);
      toast.error(err?.response?.data?.message || 'Error deleting playlist');
    }
  };

  const handleRemoveVideo = async () => {
    try {
      await removeVideoFromPlaylist(playlistId, videoToRemove);
      setCurrentPlaylist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoToRemove)
      }));
      setVideoToRemove(null);
      toast.success('Video removed from playlist');
    } catch (err) {
      console.error('Error removing video:', err);
      toast.error(err?.response?.data?.message || 'Error removing video');
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

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Playlists</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className={`px-4 py-2 rounded ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white inline-block`}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {playlistId ? (
          // Single Playlist View
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/playlists')}
                className={`flex items-center px-3 py-1 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <FiChevronLeft className="mr-1" />
                <span>Back to Playlists</span>
              </button>
              {user._id === currentPlaylist?.owner?._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditData({
                        name: currentPlaylist.name,
                        description: currentPlaylist.description,
                      });
                    }}
                    className={`flex items-center px-3 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <FiEdit2 className="mr-1" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setPlaylistToDelete(playlistId);
                      setShowDeleteModal(true);
                    }}
                    className={`flex items-center px-3 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'
                    } text-red-600 dark:text-red-400`}
                  >
                    <FiTrash2 className="mr-1" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className={`mb-8 p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white border'
              }`}>
                <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Title</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className={`w-full p-2 rounded border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className={`w-full p-2 rounded border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      rows="3"
                    />
                  </div>
                
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePlaylist}
                      className={`px-4 py-2 rounded ${
                        theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">{currentPlaylist?.name}</h1>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{currentPlaylist?.description}</p>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {currentPlaylist?.videos?.length || 0} videos • Created by {currentPlaylist?.owner?.username}
                </div>
              </div>
            )}

            {currentPlaylist?.videos?.length > 0 ? (
              <VideoGrid 
                videos={currentPlaylist.videos} 
                theme={theme}
                showRemove={user._id === currentPlaylist.owner?._id}
                onRemove={(videoId) => {
                  setVideoToRemove(videoId);
                  setShowDeleteModal(true);
                }}
              />
            ) : (
              <div className={`text-center py-12 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                <FiVideo size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-medium">No videos in this playlist</h3>
                <p>Add videos to get started</p>
              </div>
            )}
          </div>
        ) : (
          // All Playlists View
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Your Playlists</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className={`flex items-center px-4 py-2 rounded-full ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FiPlus className="mr-1" />
                <span>Create Playlist</span>
              </button>
            </div>

            {showCreateForm && (
              <div className={`mb-8 p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white border'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Create New Playlist</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className={`p-1 rounded-full ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                  >
                    <FiX />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Title</label>
                    <input
                      type="text"
                      value={newPlaylistData.name}
                      onChange={(e) => setNewPlaylistData({...newPlaylistData, name: e.target.value})}
                      className={`w-full p-2 rounded border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      placeholder="My Awesome Playlist"
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Description</label>
                    <textarea
                      value={newPlaylistData.description}
                      onChange={(e) => setNewPlaylistData({...newPlaylistData, description: e.target.value})}
                      className={`w-full p-2 rounded border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      rows="3"
                      placeholder="Describe your playlist..."
                    />
                  </div>
                 
                  <div className="flex justify-end">
                    <button
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistData.name.trim()}
                      className={`px-4 py-2 rounded ${
                        !newPlaylistData.name.trim()
                          ? 'bg-blue-400 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      Create Playlist
                    </button>
                  </div>
                </div>
              </div>
            )}

            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist._id}
                    whileHover={{ y: -5 }}
                    className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                      theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Link to={`/playlists/${playlist._id}`} className="block">
                      <div className={`h-40 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      } flex items-center justify-center`}>
                        {playlist.videos?.length > 0 ? (
                          <img
                            src={playlist.videos[0].thumbnail}
                            alt="Playlist thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiList size={48} className={
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          } />
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {playlist.videos?.length || 0} videos
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        <p className={`text-sm mt-1 truncate ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {playlist.description || 'No description'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                <FiList size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-medium">No playlists yet</h3>
                <p>Create your first playlist to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPlaylistToDelete(null);
          setVideoToRemove(null);
        }}
        onConfirm={playlistToDelete ? handleDeletePlaylist : handleRemoveVideo}
        title={playlistToDelete ? "Delete Playlist" : "Remove Video"}
        message={
          playlistToDelete 
            ? "Are you sure you want to delete this playlist?" 
            : "Are you sure you want to remove this video from the playlist?"
        }
        theme={theme}
      />
    </div>
  );
};

export default PlaylistPage;