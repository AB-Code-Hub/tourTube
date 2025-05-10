import express from "express";
import morgan from "morgan";
import logger from "./utils/logger.js";
import cors from "cors";
import { CORS_ORIGIN } from "./utils/env.js";
import healthCheckRouter from "./routes/healthCheck.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";

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

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);


app.use(errorHandler);

export { app };
