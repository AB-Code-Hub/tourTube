import express from "express";

import cors from "cors";
import { CORS_ORIGIN } from "./utils/env.js";
import healthCheckRouter from "./routes/healthCheck.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import tweetRouter from "./routes/tweet.route.js";
import playlistRouter from "./routes/playlist.route.js";
import subscriptionRouter from "./routes/subscription.route.js";

import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();

// common middlewares

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true, limit: "24kb" }));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);


app.use(errorHandler);

export { app };
