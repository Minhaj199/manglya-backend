import mongoose, { Schema } from "mongoose";

import { ISubscriptionPlanModel } from "../types/TypesAndInterfaces";

const planSchema = new Schema<ISubscriptionPlanModel>({
  name: { type: String, unique: true },
  duration: Number,
  features: [String],
  amount: Number,
  connect: Number,
  delete: { type: Boolean, default: false },
});

export const planModel = mongoose.model<ISubscriptionPlanModel>(
  "Plan",
  planSchema
);
