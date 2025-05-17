import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";


const router = Router();

router.use(verifyJwtToken);


router.route("/create").post(createTweet)
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet)
router.route("/").get(getAllTweets);
export default router;


