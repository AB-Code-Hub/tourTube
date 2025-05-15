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

export {updateUserProfile, updateUserAvatar, updateUserCoverImage}