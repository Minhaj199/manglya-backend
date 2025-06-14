import mongoose from "mongoose";
import { IMessage } from "../types/TypesAndInterfaces.ts";

const messageSchema=new mongoose.Schema<IMessage>({
    chatRoomId:mongoose.Schema.ObjectId,
    senderId:{type:mongoose.Schema.ObjectId,ref:'User'},
    text:String,
    receiverId:{type:mongoose.Schema.ObjectId,ref:'User'},
    viewedOnNav:Boolean,
    viewedList:Boolean,
    image:Boolean

},{
    timestamps:true
})

export const messageModel=mongoose.model<IMessage>('messages',messageSchema)