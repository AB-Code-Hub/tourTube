import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/videos.model.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const {page=1, limit=10, query, sortBy, sortType, userId} = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy: sortBy || 'createdAt',
        sortType: sortType || 'desc',
    };

    const filter = {
        ...(query && { title: { $regex: query, $options: 'i' } }),
        ...(userId && { userId })
    };

    const videos = await Video.paginate(filter, options);

    return res.status(200).json(new ApiResponse(200, videos, "Videos retrieved successfully"));
})


const publishedVideo = asyncHandler(async (req, res) => {
        const {title, description} = req.body;

            const videoLocalPath = req.files?.videoFile?.[0]?.path;
            const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
            if (!videoLocalPath) {
                throw new ApiError(400, "Video file is required");
            }

            if(!thumbnailLocalPath) {
                throw new ApiError(400, "thumbnial file is required")
            }

            let video;
            try {
                video = await uploadOnCloudinary(videoLocalPath)
            } catch (error) {
                
                throw new ApiError(500, "Error uploading video to Cloudinary");
            }

            let thumbnail;
            try {
                thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
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
                    owner: req.user?._id
                })

                const uploadedVideo = await Video.findById(createdVideo._id).populate("owner", "fullName email avatar");

                if(!uploadedVideo) {
                    throw new ApiError(404, "Video not found")
                }

                return res.status(201)
                .json(new ApiResponse(201, uploadedVideo, "Video uploaded successfully"));
            } catch (error) {
                if(video)
                {
                    await deleteFromCloudinary(video.public_id)
                }

                if(thumbnail)
                {
                    await deleteFromCloudinary(thumbnail.public_id)
                }

                throw new ApiError(500, "something went wrong while uploading video")
            }

})


export {publishedVideo}