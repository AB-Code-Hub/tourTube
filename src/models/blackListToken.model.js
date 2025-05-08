import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      expires: 0, 
    },
  },
  { timestamps: true }
);

export const BlackListToken = mongoose.model(
  "BlackListToken",
  blackListTokenSchema
);
