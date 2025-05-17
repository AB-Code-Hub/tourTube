import client from "./client";

export const likeVideo = async (id) => await client.post(`/likes/videos/${id}`);

export const likeComment = async (commentId) => await client.post(`/likes/comments/${commentId}`);

export const fetchLikedVideos  = async () => await client.get(`/likes/likedVideos`);