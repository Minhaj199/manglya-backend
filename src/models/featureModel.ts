import mongoose, { Schema } from "mongoose";
import { IFeatures } from "../types/TypesAndInterfaces";

const featureFeatures = new Schema<IFeatures>({
  features: [String],
});

export const featureModel = mongoose.model<IFeatures>(
  "feature",
  featureFeatures
);
