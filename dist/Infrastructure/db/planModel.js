import mongoose, { Schema } from "mongoose";
const planSchema = new Schema({
    name: { type: String, unique: true },
    duration: Number,
    features: [String],
    amount: Number,
    connect: Number,
    delete: { type: Boolean, default: false }
});
export const planModel = mongoose.model('Plan', planSchema);
