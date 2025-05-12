import { Router } from "express";
import {
  createComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken);

router.route("/video/:videoId").get(getVideoComments).post(createComment);

router.route("/:commentId").patch(updateComment).delete(deleteComment);

export default router;
