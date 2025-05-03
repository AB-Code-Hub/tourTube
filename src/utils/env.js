import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  CORS_ORIGIN,
  DB_NAME,
  DB_URL,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
} = process.env;
