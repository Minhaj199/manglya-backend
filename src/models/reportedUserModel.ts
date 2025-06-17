import mongoose, { Schema } from "mongoose";
import { IReportAbuserMongoDoc } from "../types/TypesAndInterfaces";

const reportSchama = new Schema<IReportAbuserMongoDoc>({
  reporter: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reported: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  reason: { type: String, required: true },
  rejected: { type: Boolean, default: false },
  moreInfo: { type: String, required: true },
  read: { type: Boolean, required: true },
  warningMail: { type: Boolean, required: true },
  createdAt: { type: Date, default: new Date() },
  block: { type: Boolean, default: false },
});
export const reportUser = mongoose.model<IReportAbuserMongoDoc>(
  "abuse_reports",
  reportSchama
);
