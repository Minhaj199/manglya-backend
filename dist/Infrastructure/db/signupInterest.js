import mongoose, { Schema } from "mongoose";
const interestSchem = new Schema({
    sports: { type: [String], required: true },
    music: { type: [String], required: true },
    food: { type: [String], required: true },
});
export const InterestModel = mongoose.model('Interests', interestSchem);
