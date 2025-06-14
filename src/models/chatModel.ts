import mongoose, { Schema } from "mongoose";
import { IChatRoom } from "../types/TypesAndInterfaces";

const chatSchema = new Schema<IChatRoom>(
  {
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const chatModel = mongoose.model<IChatRoom>("Chat", chatSchema);
