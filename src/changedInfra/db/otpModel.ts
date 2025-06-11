import mongoose,{Schema,Document} from "mongoose";
import { OTPWithID } from "../../types/TypesAndInterfaces.ts";



const otpSchema=new Schema<OTPWithID>({
    otp:{type:Number,required:true},
    email:{type:String,required:true},
    from:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60*2 });

export const OtpModel=mongoose.model<OTPWithID>('Otps',otpSchema)