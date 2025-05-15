import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  checkSubscriptionStatus,
} from "../controllers/subscription.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken);

// Toggle subscription status
router.route("/c/:channelId").post(toggleSubscription);

// Get channel subscribers
router.route("/channel/:channelId/subscribers").get(getUserChannelSubscribers);

// Get user's subscribed channels
router.route("/user/subscribed").get(getSubscribedChannels);

router.route("/check-subscription/:channelId").get(checkSubscriptionStatus)

export default router;
