import mongoose,{ Schema, } from "mongoose";
import { ChatRoom } from "../../types/TypesAndInterfaces.ts";

const chatSchema=new Schema<ChatRoom>({
    members:[{type:mongoose.Schema.ObjectId,ref:'User'}]
},
{
    timestamps:true
}
)

export const chatModel=mongoose.model<ChatRoom>('Chat',chatSchema)