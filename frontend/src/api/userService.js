import client from "./client";


const updateUserProfile = async (data) => {
  return await client.put("/users/update-details", data);
}

const updateUserAvatar = async (formData) => {
  return await client.patch("/users/update-avatar", formData);
}

const updateUserCoverImage = async (formData) => {
  return await client.patch("/users/update-coverimage", formData);
}

 const changePassword = (data) => {
  return client.post('/users/change-password', data);
};

// Get watch history
 const fetchWatchHistory = () => {
  return client.get('/users/history');
};

export {updateUserProfile, updateUserAvatar, updateUserCoverImage, changePassword, fetchWatchHistory}