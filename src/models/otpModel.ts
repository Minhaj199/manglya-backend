import mongoose,{Schema} from "mongoose";
import { IOTPWithID } from "../types/TypesAndInterfaces"; 



const otpSchema=new Schema<IOTPWithID>({
    otp:{type:Number,required:true},
    email:{type:String,required:true},
    from:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60*2 });

export const OtpModel=mongoose.model<IOTPWithID>('Otps',otpSchema)