import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { getVideoById, publishedVideo, updateVideo } from "../controllers/video.controller.js";

const router = Router()

router.use(verifyJwtToken)

router.route("/publish").post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1,

    },

    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishedVideo)

router.route("/find/:videoId").get(getVideoById)

router.route("/update/:videoId").put(upload.single("thumbnail"), updateVideo)


export default router