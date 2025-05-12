import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      quality: "auto", 
      fetch_format: "auto", 
      flags: "attachment", 
      transformation: [
        {
          width: 1280,
          height: 720,
          crop: "limit",
          format: "auto",
        },
      ],
    });

    fs.unlinkSync(localFilePath);
    return cloudinaryResponse;
  } catch (error) {
    console.error("error in cloudinary", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("error deleting image on cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
