import client from './client';

export const fetchComments = (videoId) =>
  client.get(`/comments/video/${videoId}`);

export const postComment = (videoId, content) =>
  client.post(`/comments/video/${videoId}`, { content });



export const updateComment = (commentId, content) => {
  return client.patch(`/comments/${commentId}`, { content });
};

export const deleteComment = (commentId) =>
  client.delete(`/comments/${commentId}`);
