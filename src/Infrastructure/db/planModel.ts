import mongoose, { Schema,Document } from "mongoose";

import { subscriptionPlanModel } from "../../types/TypesAndInterfaces.js";


const planSchema=new Schema<subscriptionPlanModel>({
    name:{type:String,unique:true},
    duration:Number,
    features:[String],
    amount:Number,
    connect:Number,
    delete:{type:Boolean,default:false}
})

export const planModel=mongoose.model<subscriptionPlanModel>('Plan',planSchema)