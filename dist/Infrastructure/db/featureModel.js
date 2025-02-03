import mongoose, { Schema } from "mongoose";
const featureFeatures = new Schema({
    features: [String]
});
export const featureModel = mongoose.model('feature', featureFeatures);
