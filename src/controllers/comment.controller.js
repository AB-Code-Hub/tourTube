import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const aggregationPipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
        foreignField: "comment",
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
        content: 1,
        owner: 1,
        video: 1,
        createdAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const comments = await Comment.aggregate([
    ...aggregationPipeline,
    {
      $skip: (options.page - 1) * options.limit,
    },
    {
      $limit: options.limit,
    },
  ]);

  const totalComments = await Comment.countDocuments({
    video: videoId,
  });

  const response = {
    comments,
    totalComments,
    currentPage: options.page,
    totalPages: Math.ceil(totalComments / options.limit),
    limit: options.limit,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Comments retrieved successfully"));
});

const createComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: req.user._id,
  });

  const createdComment = await Comment.aggregate([
    {
      $match: {
        _id: comment._id,
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
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $project: {
              title: 1,
              thumbnail: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        video: { $first: "$video" },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        video: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!createdComment?.length) {
    throw new ApiError(500, "Failed to create comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdComment[0], "Comment created successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  await Comment.findByIdAndUpdate(commentId, {
    $set: {
      content,
    },
  });

  const updatedComment = await Comment.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(commentId),
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
        foreignField: "comment",
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
        content: 1,
        owner: 1,
        video: 1,
        createdAt: 1,
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!updatedComment?.length) {
    throw new ApiError(404, "Comment not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment[0], "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await Promise.all([
    Comment.findByIdAndDelete(commentId),
    Like.deleteMany({ comment: commentId }),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Comment and associated data deleted successfully"
      )
    );
});

export { createComment, getVideoComments, updateComment, deleteComment };
