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

// secured routes

router.route("/logout").post(verifyJwtToken, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/profile").get(verifyJwtToken, getCurrentUser);

router.route("/change-password").post(verifyJwtToken, updateUserPassword);

router.route("/update-details").post(verifyJwtToken, updateAcoountDetails);

router
  .route("/update-avatar")
  .post(verifyJwtToken, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover-image")
  .post(verifyJwtToken, upload.single("coverImage"), updateUserCoverimage);

export default router;
