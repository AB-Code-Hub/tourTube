import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  updateUserPassword,
  updateAcoountDetails,
  updateUserAvatar,
  updateUserCoverimage,
  getCurrentUser,
  getUserChannelProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },

    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

// secured routes

router.route("/logout").post(verifyJwtToken, logoutUser);

router.route("/profile").get(verifyJwtToken, getCurrentUser);

router.route("/change-password").post(verifyJwtToken, updateUserPassword);

router.route("/update-details").put(verifyJwtToken, updateAcoountDetails);

router
  .route("/update-avatar")
  .patch(verifyJwtToken, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverimage")
  .patch(verifyJwtToken, upload.single("coverImage"), updateUserCoverimage);

router.route("/channel/:username").get(verifyJwtToken, getUserChannelProfile);

router.route("/history").get(verifyJwtToken, getUserWatchHistory);

export default router;
