import mongoose, { Schema,Document } from "mongoose";
import { InterestInterface } from "../../types/TypesAndInterfaces.ts";



const interestSchem=new Schema <InterestInterface>({
    sports:{type:[String],required:true},
    music:{type:[String],required:true},
    food:{type:[String],required:true},
})

export const InterestModel=mongoose.model<InterestInterface>('Interests',interestSchem)