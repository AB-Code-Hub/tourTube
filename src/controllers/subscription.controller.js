import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (subscriberId.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
    } else {
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });
    }

    // Get updated subscription status and counts
    const subscriptionStatus = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [subscriberId, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                username: 1,
                fullName: 1,
                avatar: 1
            }
        }
    ]);

    if (!subscriptionStatus?.length) {
        throw new ApiError(500, "Error while fetching subscription status");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            subscriptionStatus[0],
            existingSubscription ? "Unsubscribed successfully" : "Subscribed successfully"
        ));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const aggregationPipeline = [
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: { $first: "$subscriber" }
            }
        },
        {
            $project: {
                subscriber: 1,
                createdAt: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ];

    const subscribers = await Subscription.aggregate(aggregationPipeline);
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    });

    const response = {
        subscribers,
        totalSubscribers,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSubscribers / parseInt(limit)),
        limit: parseInt(limit)
    };

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            response,
            "Channel subscribers fetched successfully"
        ));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const subscriberId = req.user?._id;

    const aggregationPipeline = [
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                let: { channelId: { $first: "$channel._id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$owner", "$$channelId"]
                            }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $limit: 1
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            createdAt: 1
                        }
                    }
                ],
                as: "recentVideo"
            }
        },
        {
            $addFields: {
                channel: { $first: "$channel" },
                recentVideo: { $first: "$recentVideo" }
            }
        },
        {
            $project: {
                channel: 1,
                recentVideo: 1,
                createdAt: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ];

    const subscribedChannels = await Subscription.aggregate(aggregationPipeline);
    const totalSubscriptions = await Subscription.countDocuments({
        subscriber: subscriberId
    });

    const response = {
        subscribedChannels,
        totalSubscriptions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSubscriptions / parseInt(limit)),
        limit: parseInt(limit)
    };

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            response,
            "Subscribed channels fetched successfully"
        ));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};