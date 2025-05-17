import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken);

router.route("/videos/:videoId").post(toggleVideoLike);

router.route("/comments/:commentId").post(toggleCommentLike);

router.route("/tweets/:tweetId").post(toggleTweetLike);

router.route("/likedVideos").get(getLikedVideos);

export default router;
