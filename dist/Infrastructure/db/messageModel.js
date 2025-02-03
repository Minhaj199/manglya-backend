import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    chatRoomId: mongoose.Schema.ObjectId,
    senderId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    text: String,
    receiverId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    viewedOnNav: Boolean,
    viewedList: Boolean,
    image: Boolean
}, {
    timestamps: true
});
export const messageModel = mongoose.model('messages', messageSchema);
