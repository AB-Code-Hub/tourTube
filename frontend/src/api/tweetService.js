import client from "./client";

export const createTweet = async (content) => {
  const response = await client.post('/tweets/create', { content });
  return response;
};

export const getUserTweets = async (userId) => {
  const response = await client.get(`/tweets/user/${userId}`);
  return response;
};

export const updateTweet = async (tweetId, content) => {
  const response = await  client.patch(`/tweets/${tweetId}`, { content });
  return response;
};

export const deleteTweet = async (tweetId) => {
  const response = await client.delete(`/tweets/${tweetId}`);
  return response.data;
};

export const getTweets = async () => {
  const response = await client.get('/tweets');
  return response;
}

