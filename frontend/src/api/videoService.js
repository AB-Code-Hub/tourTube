import client from "./client";

export const fetchAllVideos = async () => await client.get("/videos");
export const likeVideo = async (id) => await client.post(`/likes/videos/${id}`);
export const uploadVideo = async (videoData) => await client.post("/videos/publish", videoData);
export const fetchVideoById = async (id) => await client.get(`/videos/${id}`);
