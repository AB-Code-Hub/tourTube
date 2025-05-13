import client from './client';

export const fetchComments = (videoId) =>
  client.get(`/comments/video/${videoId}`);

export const postComment = (videoId, content) =>
  client.post(`/comments/video/${videoId}`, { content });
