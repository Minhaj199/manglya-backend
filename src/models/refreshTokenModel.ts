import mongoose, { Schema } from "mongoose";
import { IRefeshToken } from "../types/TypesAndInterfaces";

const tokenSchema = new Schema<IRefeshToken>(
  {
    userId: { type: Schema.ObjectId, ref: "User" },
    token: String,
    expiresAt: Date,
  },
  { timestamps: true }
);
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400000 });
tokenSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 86400000);
  next();
});
export const refeshTokenModel = mongoose.model<IRefeshToken>(
  "refeshTokens",
  tokenSchema
);
