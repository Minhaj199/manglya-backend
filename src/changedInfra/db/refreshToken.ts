import mongoose,{ Schema } from "mongoose";
import { RefeshToken } from "../../types/TypesAndInterfaces.ts";



const tokenSchema=new Schema<RefeshToken>({
    userId:{type:Schema.ObjectId,ref:'User'},
    token:String,
    expiresAt:Date
},{timestamps:true})
tokenSchema.index({createdAt:1},{ expireAfterSeconds: 86400000  })
tokenSchema.pre('save',function(next){
    this.expiresAt=new Date(Date.now()+86400000)
    next()
})
export const refeshTokenModel=mongoose.model<RefeshToken>('refeshTokens',tokenSchema)
