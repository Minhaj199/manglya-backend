import mongoose, { Schema, Types } from "mongoose";
const PlanOrderSchema = new Schema({
    userID: Types.ObjectId,
    amount: Number,
    connect: Number,
    avialbleConnect: Number,
    duration: Number,
    features: [String],
    name: String,
    Expiry: Date,
    created: { type: Date, default: new Date() }
});
export const planOrderModel = mongoose.model('Plan_Order', PlanOrderSchema);
