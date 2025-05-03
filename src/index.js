import morgan from "morgan";
import logger from "./utils/logger.js";
import { app } from "./app.js";
import express from "express";
const port = 7860;

const morganFormat = ":method :url :status :response-time ms";

app.use(express.json());
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

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
