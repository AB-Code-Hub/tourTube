import client from "./client";

export const fetchAllVideos = async (params = {}) =>
  await client.get("/videos", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      query: params.query || "",
      sortBy: params.sortBy || "createdAt",
      sortType: params.sortType || "desc",
    },
  });

export const fetchUserVideos = async (userId) => {
  const response = await client.get(`dashboard/videos/${userId}`);
  return response;
};
export const likeVideo = async (id) => await client.post(`/likes/videos/${id}`);
export const uploadVideo = async (videoData) =>
  await client.post("/videos/publish", videoData);
export const updateVideo = async (id, videoData) =>
  await client.patch(`/videos/update/${id}`, videoData);
export const fetchVideoById = async (id) => await client.get(`/videos/${id}`);
export const fetchUserByUsername = async (username) =>
  await client.get(`/users/channel/${username}`);
export const toggleVideoVisibility = async (videoId) => {
  const response = await client.patch(`/videos/toggle/publish/${videoId}`);
  return response;
};
export const deleteVideo = (videoId) => {
  return client.delete(`/videos/${videoId}`);
};
export const createVideo = async (videoData) =>
  await client.post("/videos/publish", videoData);
