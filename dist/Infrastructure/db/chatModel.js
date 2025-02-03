import mongoose, { Schema, } from "mongoose";
const chatSchema = new Schema({
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});
export const chatModel = mongoose.model('Chat', chatSchema);
