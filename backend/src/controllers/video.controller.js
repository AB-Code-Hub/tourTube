import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.model.js";
import mongoose from "mongoose";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import {
  pubishedVideoValidation,
  updateVideoValidation,
} from "../validation/video.validation.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { VideoView } from "../models/videoView.model.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // Search for channels if query exists
  let channels = [];
  if (query) {
    channels = await User.aggregate([
      {
        $match: {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          fullName: 1,
          avatar: 1,
          subscribersCount: 1,
          isSubscribed: 1,
        },
      },
      {
        $limit: 12, // Limit channel results
      },
    ]);
  }

  const pipeline = [
    {
      $match: {
        ...(query && { title: { $regex: query, $options: "i" } }),
        ...(userId && { owner: new mongoose.Types.ObjectId(userId) }),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ];

  if (sortBy && sortType) {
    pipeline.push({
      $sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
    });
  } else {
    pipeline.push({
      $sort: { createdAt: -1 },
    });
  }

  pipeline.push(
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    }
  );

  const videos = await Video.aggregate(pipeline);
  const totalVideos = await Video.countDocuments({
    ...(query && { title: { $regex: query, $options: "i" } }),
    ...(userId && { owner: new mongoose.Types.ObjectId(userId) }),
    isPublished: true,
  });
  const response = {
    videos,
    channels: query ? channels : [], // Only include channels if there's a search query
    totalVideos,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalVideos / parseInt(limit)),
    limit: parseInt(limit),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        response,
        "Videos and channels retrieved successfully"
      )
    );
});

const publishedVideo = asyncHandler(async (req, res) => {
  const { error } = pubishedVideoValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { title, description } = req.body;

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnial file is required");
  }

  let video;
  try {
    video = await uploadOnCloudinary(videoLocalPath);
  } catch (error) {
    throw new ApiError(500, "Error uploading video to Cloudinary");
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  } catch (error) {
    throw new ApiError(500, "Error uploading thumbnail to Cloudinary");
  }

  try {
    const createdVideo = await Video.create({
      title,
      description,
      videoFile: video?.url,
      thumbnail: thumbnail?.url,
      duration: video?.duration,
      owner: req.user?._id,
    });

    const uploadedVideo = await Video.aggregate([
      {
        $match: {
          _id: createdVideo._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          owner: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!uploadedVideo?.length) {
      throw new ApiError(404, "Video not found after creation");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, uploadedVideo[0], "Video uploaded successfully")
      );
  } catch (error) {
    if (video) {
      await deleteFromCloudinary(video.public_id);
    }

    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }

    throw new ApiError(500, "something went wrong while uploading video");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  // Get user identifier (either user ID or IP address)
  const userId = req.user?._id || req.ip;

  // Add to watch history if user is authenticated
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: videoId }, // Using $addToSet to avoid duplicates
    });
  }

  try {
    // Try to create a new view record
    await VideoView.create({
      video: videoId,
      user: userId.toString(),
    });

    // Only increment the view if we successfully created a view record
    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });
  } catch (error) {
    // If error is duplicate key error, ignore it (user already viewed within time window)
    if (error.code !== 11000) {
      console.error("Error tracking video view:", error);
    }
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!video?.length) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const { error } = updateVideoValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file is required");
  }

  let thumbnail;
  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  } catch (error) {
    if (thumbnail) {
      await deleteFromCloudinary(thumbnail.public_id);
    }
    throw new ApiError(500, "Error uploading thumbnail to Cloudinary");
  }

  await Video.findByIdAndUpdate(videoId, {
    $set: {
      title,
      description,
      thumbnail: thumbnail?.url,
    },
  });

  // Get updated video with aggregation
  const updatedVideo = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!updatedVideo?.length) {
    throw new ApiError(404, "Video not found after update");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo[0], "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "video Id is required");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
  ]);

  if (!video?.length) {
    throw new ApiError(404, "Video not found");
  }

  await Promise.all([
    Video.findByIdAndDelete(videoId),
    Like.deleteMany({ video: videoId }),
    Comment.deleteMany({ video: videoId }),
  ]);

  const videoUrl = video[0].videoFile;
  const thumbnailUrl = video[0].thumbnail;

  if (videoUrl) {
    const videoPublicId = videoUrl.split("/").slice(-1)[0].split(".")[0];
    await deleteFromCloudinary(videoPublicId);
  }

  if (thumbnailUrl) {
    const thumbnailPublicId = thumbnailUrl
      .split("/")
      .slice(-1)[0]
      .split(".")[0];
    await deleteFromCloudinary(thumbnailPublicId);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Video and associated data deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await Video.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: !video.isPublished,
    },
  });

  const updatedVideo = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
      },
    },
  ]);

  if (!updatedVideo?.length) {
    throw new ApiError(404, "Video not found after status update");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo[0], "Video status updated successfully")
    );
});

export {
  publishedVideo,
  getVideoById,
  updateVideo,
  getAllVideos,
  deleteVideo,
  togglePublishStatus,
};
