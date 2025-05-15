import client from "./client";

const subscribeToChannel = async (channelId) => {
  return await client.post(`/subscriptions/c/${channelId}`);
}

const checkSubscription = async (channelId) => {
    return await client.get(`/subscriptions/check-subscription/${channelId}`);
}

const channelSubcribers = async (channelId) => {
  return await client.get(`/subscriptions/channel/${channelId}/subscribers`);
}

const userSubscribedChannels = async () => {
  return await client.get(`/subscriptions/user/subscribed`);
}

export { subscribeToChannel, checkSubscription, channelSubcribers, userSubscribedChannels }