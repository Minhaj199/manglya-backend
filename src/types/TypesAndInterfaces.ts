
import {Document, Types} from 'mongoose'
import { User } from "../domain/entity/userEntity.js"
import { OtpEntity } from '../domain/entity/otpEntity.js'
import { UserRepository } from '../domain/interface/userRepositoryInterface.js'
import { SubscriptionPlan } from '../domain/entity/PlanEntity.js'



import { AbuserReport } from '../domain/entity/abuse.js'




export type fetchDateForUserSelection={
    id:Types.ObjectId,
    name:string,
    secondName:string,
    state:string,
    gender:string,
    dateOfBirth:Date
}[]
export type profileTypeFetch = {name:string,
    lookingFor:string,secondName:string,
    state:string,gender:string,
    dateOfBirth:Date,interest:string[],
    photo:string,
    _id?:string
}[]
export type userForLanding={
    name:string
    age:number
    image:string

}
export type MatchedProfile={
    _id:string 
    state:string
    photo:string|undefined,
    dateOfBirth:Date
    firstName:string
    lastName:string
}
export interface UserWithID extends User,Document{
    
}
export interface PlanOrders<ID>{
    userID:ID,
    name:string,
    duration:number
    features:string[]
    amount:string
    connect:number
    avialbleConnect:number
    Expiry:Date
    created?:Date
}
export interface PlanOrder extends PlanOrders<Types.ObjectId>{
    userID:Types.ObjectId
}
export interface PlanOrdersEntity extends PlanOrders<string>{
    userID:string
}
export interface PlanOrderMongo extends Document,PlanOrder{
   
}

export interface FirstBatch{
      
    'SECOND NAME':string;
      'DATE OF BIRTH':string;
      'DISTRICT THAT YOU LIVE':string;
      'YOUR GENDER':string;
      'GENDER OF PARTNER':string;
      'EMAIL':string;
      'PASSWORD':string,
      'FIRST NAME':string   
    
}
export interface OTPWithID extends OtpEntity,Document{
}


export interface PatnerProfileServiceInterface{
    addMatch(userId: unknown, matchedId: string,userRepository:UserRepository):Promise<boolean>
}
export interface ImageServiceInterface{
    upload(path:string):Promise<string>
}

export interface InterestInterface extends Document{
    sports:string[];
    music:string[]
    food:string[]
}

export interface UserCurrentPlan extends subscriptionPlanModel{
    avialbleConnect:number
}
export interface LandingShowUesrsInterface{
    
        name: string;
        secondName: string;
        age: Date;
        image: string;
    
}

export type updateData={
    PersonalInfo: {   
      firstName:string,  
      secondName: string, 
      state: string,      
      gender: string,     
      dateOfBirth: Date|string,    
      interest: string[]|null, 
    },
    partnerData: { gender: string },
    email: string,
  }

  export type ExtentedMatchProfile=MatchedProfile&{age:number}
  


  export interface AbuserMongoDoc extends AbuserReport,Document {
    createdAt:Date
}
export interface suggestionType  {
    name:string,
    lookingFor:string,secondName:string,
    state:string,gender:string,
    dateOfBirth:Date,interest:string[],
    photo:string,
    _id?:string,
    subscriber:'subscribed'|'Not subscribed'|'connection over'
    planFeatures:string[]
    matchStatics?:string
}
export interface ChatRoom extends Document{
    members:Types.ObjectId[]
}
export interface IMessage extends Document {
    chatRoomId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId:Types.ObjectId,
    text: string;
    viewedOnNav: boolean;
    viewedList:boolean;
    image:boolean
    createdAt:Date
  }
  export interface IMessageWithoutId {
    chatRoomId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId:Types.ObjectId,
    text: string;
    viewedOnNav: boolean;
    viewedList:boolean;
    image:boolean
  }
export  interface Member {
    _id: Types.ObjectId;
    PersonalInfo: {
      firstName: string;
      image: string;
    };
  }
  
  export interface FetchedChat extends Document {
    members: Member[];
  }
  export interface Messages
    {
        senderId: Types.ObjectId,
        text: string,
        image: boolean,
        createdAt:Date
      }

export type MessageWithDate=IMessage&{createdAt:Date}

export interface RequestInterface extends Document{
    photo:string,
    name:string
}
export interface SubscriptionPlanDocument extends SubscriptionPlan,Document{
    delete:boolean
}
export interface IEmailService{
    sendEmail(to:string,subject:string,body:string):Promise<void>;
}
export interface AllMessageInterface{
    senderId: Types.ObjectId;
    text: string;
    image: boolean;
    createdAt: Date;
}[]
export interface ChatMessage{
    senderId:Types.ObjectId,
    text: string,
    image: boolean,
    createdAt:Date
}
export interface fetechProfileDataType{
    datas:{
        profile: profileTypeFetch;
        request: profileTypeFetch;
    }[],currntPlan:subscriptionPlanModel,
    interest:string[]
}
export interface userProfileReturnType{
    PersonalInfo: {
        age: number;
        firstName: string;
        secondName: string;
        state: string;
        gender: string;
        dateOfBirth: Date;
        image?: string;
        interest?: string[];
    };
    PartnerData: {
        gender: string;
    };
    Email: string;
    subscriptionStatus: string;
    currentPlan: PlanOrdersEntity | undefined;
}
export interface userMgtUserfetchUserDatasForAdmin{
    expiry: string | Date;
    no: number;
    username: string;
    email: string;
    match: {
        _id: string;
        status: string;
        typeOfRequest: string;
    }[];
    subscriber: string;
    CreatedAt: Date;
    block: boolean;
}
export interface adminPlanType{
        no:number
        username: string,
        planName:string,
        MatchCountRemaining:number,
        expiry: Date|string,
        planAmount: string
      }
export interface RefeshToken extends Document{
    userId:Types.ObjectId,
    token:string
    expiresAt?:Date
}
export interface RefreshWithPopulatedData extends Document{
    userId:UserWithID,
    token:string
}
export interface subscriptionPlanModel extends SubscriptionPlan,Document{
    delete:boolean
}