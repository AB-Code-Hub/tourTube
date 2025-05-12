import mongoose from "mongoose";
import { Video } from "../models/videos.model.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Get all stats in parallel using Promise.all
  const [videoStats, subscriberStats, likesStats] = await Promise.all([
    // Get video stats (total videos, views, duration)
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalDuration: { $sum: "$duration" },
        },
      },
    ]),

    // Get subscriber stats
    Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: 1 },
        },
      },
    ]),

    // Get likes stats (likes on videos)
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
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
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
    ]),
  ]);

  const stats = {
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalSubscribers: subscriberStats[0]?.totalSubscribers || 0,
    totalLikes: likesStats[0]?.totalLikes || 0,
    totalDuration: videoStats[0]?.totalDuration || 0,
  };

  // Get the last 30 days videos performance
  const last30DaysStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        views: { $sum: "$views" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channelStats: stats,
        last30DaysPerformance: last30DaysStats,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
    query,
  } = req.query;
  const userId = req.user?._id;

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
        ...(query && { title: { $regex: query, $options: "i" } }),
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
              username: 1,
              fullName: 1,
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
        isPublished: 1,
        likesCount: 1,
      },
    },
  ];

  // Add sorting
  pipeline.push({
    $sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
  });

  // Add pagination
  pipeline.push(
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) }
  );

  const videos = await Video.aggregate(pipeline);

  const totalVideos = await Video.countDocuments({
    owner: userId,
    ...(query && { title: { $regex: query, $options: "i" } }),
  });

  const response = {
    videos,
    totalVideos,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalVideos / parseInt(limit)),
    limit: parseInt(limit),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "Channel videos fetched successfully")
    );
});

export { getChannelStats, getChannelVideos };
