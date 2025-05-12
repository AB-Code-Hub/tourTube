import { app } from "./app.js";
import connectDB from "./db/db.js";
import { PORT } from "./utils/env.js";

const port = PORT || 7860;


connectDB()
.then(() => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
  
})
.catch((error) => {
  console.log("mongoDB connection error", error);
})