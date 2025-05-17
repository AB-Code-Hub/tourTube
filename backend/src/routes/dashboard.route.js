import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken);

// Get channel statistics
router.route("/stats").get(getChannelStats);

// Get channel videos
router.route("/videos/:userId").get(getChannelVideos);

export default router;
