import dotenv from "dotenv";

dotenv.config();

export const { PORT, CORS_ORIGIN, DB_NAME, DB_URL } = process.env;
