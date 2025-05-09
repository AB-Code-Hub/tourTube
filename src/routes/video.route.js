import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { publishedVideo } from "../controllers/video.controller.js";

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


export default router