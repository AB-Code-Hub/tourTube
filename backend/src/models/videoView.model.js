import mongoose from "mongoose";

const videoViewModel = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  user: {
    type: String, // This will store either user ID or session ID
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Document will be automatically deleted after 24 hours
  },
});

// Compound index to ensure unique views within time window
videoViewModel.index({ video: 1, user: 1 }, { unique: true });

export const VideoView = mongoose.model("VideoView", videoViewModel);
