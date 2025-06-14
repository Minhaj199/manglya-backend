import mongoose,{Schema} from "mongoose";
import { IAbuserMongoDoc } from "../types/TypesAndInterfaces";


const reportSchama=new Schema<IAbuserMongoDoc>({
    reporter:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    reported:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    reason:{type:String,required:true},
    rejected:{type:Boolean,default:false},
    moreInfo:{type:String,required:true},
    read:{type:Boolean,required:true},
    warningMail:{type:Boolean,required:true},
    createdAt:{type:Date,default:new Date},
    block:{type:Boolean,default:false}
})
export const reportUser=mongoose.model<IAbuserMongoDoc>('abuse_reports',reportSchama)