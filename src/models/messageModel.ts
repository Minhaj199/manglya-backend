import mongoose from "mongoose";
import { IMessageRow } from "../types/TypesAndInterfaces";

const messageSchema = new mongoose.Schema<IMessageRow>(
  {
    chatRoomId: mongoose.Schema.ObjectId,
    senderId: { type: mongoose.Schema.ObjectId, ref: "User" },
    text: String,
    receiverId: { type: mongoose.Schema.ObjectId, ref: "User" },
    viewedOnNav: Boolean,
    viewedList: Boolean,
    image: Boolean,
  },
  {
    timestamps: true,
  }
);

export const messageModel = mongoose.model<IMessageRow>(
  "messages",
  messageSchema
);
