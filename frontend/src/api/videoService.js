import client from "./client";

export const fetchAllVideos = async (params = {}) => await client.get("/videos",{
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      query: params.query || "",
      sortBy: params.sortBy || "createdAt",
      sortType: params.sortType || "desc",
    }
  });

export const fetchUserVideos = (username) => {
  return client.get(`dashboard/videos`);
};
export const likeVideo = async (id) => await client.post(`/likes/videos/${id}`);
export const uploadVideo = async (videoData) => await client.post("/videos/publish", videoData);
export const fetchVideoById = async (id) => await client.get(`/videos/${id}`);
