

import mongoose,{Schema,Document,ObjectId, Types} from "mongoose";
import {User} from "../../domain/entity/userEntity.js";
export interface IUserModel extends User,Document{}

const userSchema=new Schema<IUserModel>({
    PersonalInfo:{
        firstName:{type:String,unique:true},
        secondName:String,
        state:String,
        gender:String,
        dateOfBirth:Date,
        image:String,
        interest:[String]
    },
    partnerData:{
        gender:String
    },
    email:{type:String,unique:true},
    password:String,
    block:Boolean,
    match:[{_id:Schema.Types.ObjectId,status:{type:String,default:'pending'} ,typeOfRequest:String}],
    subscriber:String,
    CurrentPlan:{name:String,amount:Number,connect:Number,avialbleConnect:Number,duration:Number,features:[String],Expiry:Date},
    PlanData:[{type:Types.ObjectId,ref:'PlanOrder'}],
    CreatedAt:Date

})
export const UserModel=mongoose.model<IUserModel>('User',userSchema)