import client from "./client";

export const createPlaylist = async (playlistData) => {
  const response = await client.post("/playlists", playlistData);
  return response.data;
};

export const getUserPlaylists = async (userId) => {
  const response = await client.get(`/playlists/user/${userId}`);
  return response.data;
};

export const getPlaylistById = async (playlistId) => {
  const response = await client.get(`/playlists/${playlistId}`);
  return response.data;
};

export const updatePlaylist = async (playlistId, playlistData) => {
  const response = await client.patch(`/playlists/${playlistId}`, playlistData);
  return response.data;
};

export const deletePlaylist = async (playlistId) => {
  const response = await client.delete(`/playlists/${playlistId}`);
  return response.data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const response = await client.post(`/playlists/${playlistId}/v/${videoId}`);
  return response.data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const response = await client.delete(`/playlists/${playlistId}/v/${videoId}`);
  return response.data;
};
