import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/videos.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const likeStatus = await Like.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $group: {
          _id: "$video",
          likeCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          likeCount: 1,
          isLiked: { $literal: false },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          likeStatus[0] || { likeCount: 0, isLiked: false },
          "Video unliked successfully"
        )
      );
  }

  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  if (!newLike) {
    throw new ApiError(500, "Failed to like video");
  }

  const likeStatus = await Like.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $group: {
        _id: "$video",
        likeCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        likeCount: 1,
        isLiked: { $literal: true },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus[0], "Video liked successfully"));
});

const getVideoLikeStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const likeStatus = await Like.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $group: {
        _id: "$video",
        likeCount: { $sum: 1 },
        likedByUser: {
          $push: {
            $eq: ["$likedBy", new mongoose.Types.ObjectId(req.user._id)],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        likeCount: 1,
        isLiked: {
          $in: [true, "$likedByUser"],
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likeStatus[0] || { likeCount: 0, isLiked: false },
        "Video like status retrieved successfully"
      )
    );
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const likeStatus = await Like.aggregate([
      {
        $match: {
          comment: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $group: {
          _id: "$comment",
          likeCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          likeCount: 1,
          isLiked: { $literal: false },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          likeStatus[0] || { likeCount: 0, isLiked: false },
          "Comment unliked successfully"
        )
      );
  }

  const newLike = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!newLike) {
    throw new ApiError(500, "Failed to like comment");
  }

  const likeStatus = await Like.aggregate([
    {
      $match: {
        comment: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $group: {
        _id: "$comment",
        likeCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        likeCount: 1,
        isLiked: { $literal: true },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus[0], "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const likeStatus = await Like.aggregate([
      {
        $match: {
          tweet: new mongoose.Types.ObjectId(tweetId),
        },
      },
      {
        $group: {
          _id: "$tweet",
          likeCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          likeCount: 1,
          isLiked: { $literal: false },
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          likeStatus[0] || { likeCount: 0, isLiked: false },
          "Tweet unliked successfully"
        )
      );
  }

  const newLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (!newLike) {
    throw new ApiError(500, "Failed to like tweet");
  }

  const likeStatus = await Like.aggregate([
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $group: {
        _id: "$tweet",
        likeCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        likeCount: 1,
        isLiked: { $literal: true },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus[0], "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
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
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $lookup: {
        from: "likes",
        localField: "video._id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $project: {
        _id: 0,
        video: {
          _id: 1,
          title: 1,
          description: 1,
          videoFile: 1,
          thumbnail: 1,
          duration: 1,
          views: 1,
          owner: 1,
          createdAt: 1,
        },
        likesCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos retrieved successfully")
    );
});

export {
  toggleVideoLike,
  getVideoLikeStatus,
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
};
