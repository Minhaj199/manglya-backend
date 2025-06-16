import { Document, Types } from "mongoose";
import { IUserRepository } from "../repository/interface/IUserRepository.ts";
import { IUserWithID} from "./UserRelatedTypes.ts";

//////////////////////// Report Abuser///////////////////////////
export interface IAbuserReport {
  reporter: Types.ObjectId;
  reported: Types.ObjectId;
  read: boolean;
  reason: string;
  moreInfo: string;
  warningMail: boolean;
  block: boolean;
  rejected: boolean;
}
export interface IAbuserMongoDoc extends IAbuserReport, Document {
  createdAt: Date;
}

////////////////////partner realted//////////////////
export type IMatchedProfileType = {
  _id: string;
  state: string;
  photo: string | undefined;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
};
export interface ISuggestion {
  name: string;
  lookingFor: string;
  secondName: string;
  state: string;
  gender: string;
  dateOfBirth: Date;
  interest: string[];
  photo: string;
  _id?: string;
  subscriber: "subscribed" | "Not subscribed" | "connection over";
  planFeatures: string[];
  matchStatics?: string;
}
export type IProfileTypeFetch = {name:string,
    lookingFor:string,secondName:string,
    state:string,gender:string,
    dateOfBirth:Date,interest:string[],
    photo:string,
    _id?:string
}[]

export interface IRequestInterface extends Document {
  photo: string;
  name: string;
}
export interface IFetchProfileDataType {
  datas: {
    profile: IProfileTypeFetch;
    request: IProfileTypeFetch;
  }[];
  currntPlan: ISubscriptionPlanModel;
  interest: string[];
}
export interface IPatnerProfileServiceInterface {
  addMatch(
    userId: unknown,
    matchedId: string,
    userRepository: IUserRepository
  ): Promise<boolean>;
}
export type IExtentedMatchProfile = IMatchedProfileType & { age: number };
///////////////////plan Related///////////////////////

export interface ISubscriptionPlan {
  name: string;
  duration: number;
  features: string[];
  amount: string;
  connect: string;
}
export interface IPlanOrders<ID> {
  userID: ID;
  name: string;
  duration: number;
  features: string[];
  amount: string;
  connect: number;
  avialbleConnect: number;
  Expiry: Date;
  created?: Date;
}
export interface IPlanOrder extends IPlanOrders<Types.ObjectId> {
  userID: Types.ObjectId;
}

export type CurrentPlanReturnType= never[] | {
        amount: number;
        connect: number;
        avialbleConnect: number;
        duration: number;
        features: string[];
        name: string;
        Expiry: Date;
    };
export interface IPlanOrdersEntity extends IPlanOrders<string> {
  userID: string;
}
export interface jwtInterface{
    id: string, role: string, iat?: number, exp?: number 
}
export interface PlanOrderMongo extends Document, IPlanOrder {}
export interface IUserCurrentPlan extends ISubscriptionPlanModel {
  avialbleConnect: number;
}
export interface SubscriptionPlanDocument extends ISubscriptionPlan, Document {
  delete: boolean;
}
 export type  CurrentPlanType= {
    request: IFindCurrentPlanAndRequests[]
    currertPlan: ICurrentPlan[]
  }
export interface ICurrentPlan {
 CurrentPlan:{

     amount: number;
     connect: number;
     avialbleConnect: number;
     duration: number;
     features: string[];
     name: string;
     Expiry: Date;
 }
}
export interface IFindCurrentPlanAndRequests {
  request: { _id: string; status: string; typeOfRequest: string }[];
  currertPlan: { CurrentPlan: IPlanOrdersEntity }[];
}


export interface ISubscriptionPlanModel extends ISubscriptionPlan, Document {
  delete: boolean;
}
///////////////////// otp Related////////////
export interface OtpEntity{
    otp:number;
    email:string;
    from:string,
    createdAt?:Date
}

export interface IOTPWithID extends OtpEntity, Document {}

///////////////utitlity related////////////////
export interface IJwtInterface {
  id: string;
  preferedGender: string;
  gender: string;
  role: string;
  iat?: number;
  exp?: number;
}
export interface IBcryptAdapter {
  hash(password: string): Promise<string>;
  compare(password: string, hashed: string): Promise<boolean>;
}
export type Role='user'|'admin'

export interface IFeatures extends Document {
  features: string[];
}

/////////////////interest related///////////////
export interface IInterestInterface extends Document {
  sports: string[];
  music: string[];
  food: string[];
}
export interface IInterestInput {
  sports: string[];
  music: string[];
  food: string[];
}

////////////chat related////////////

export interface ChatRoomEntity{
    member:string[]
}
export type FindNewMessagesReturn={
  
    _id: string[];
    count: number;
    userId: Types.ObjectId[];

}
export interface Message {
    chatRoomId: string
    senderId: string
    text: string;
    viewedOnNav: boolean;
    viewedList:boolean;
    image:boolean
  }
export interface IChatRoomInput {
  members: Types.ObjectId[];
}
export interface IChatRoom extends Document {
  members: Types.ObjectId[];
}
export interface IMessageOuput{
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  viewedOnNav: boolean;
  viewedList: boolean;
  image: boolean;
  createdAt: Date;
}
export interface IMessage extends Document {
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  viewedOnNav: boolean;
  viewedList: boolean;
  image: boolean;
  createdAt: Date;
}
export interface IMessageRow extends IMessage {
   updatedAt: Date
}
export interface IMessageWithoutId {
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  viewedOnNav: boolean;
  viewedList: boolean;
  image: boolean;
}
export interface IMember {
  _id: Types.ObjectId;
  PersonalInfo: {
    firstName: string;
    image: string;
  };
}

export interface IFetchedChat extends Document {
  members: IMember[];
}
export interface IMessages {
  senderId: Types.ObjectId;
  text: string;
  image: boolean;
  createdAt: Date;
}

export type MessageWithDate = IMessage & { createdAt: Date };

export interface IEmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
export interface IAllMessageInterface {
  senderId: Types.ObjectId;
  text: string;
  image: boolean;
  createdAt: Date;
}
export interface IChatMessage {
  senderId: Types.ObjectId;
  text: string;
  image: boolean;
  createdAt: Date;
}

export interface IUserDatasForAdmin {
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
export interface IAdminPlanType {
  no: number;
  username: string;
  planName: string;
  MatchCountRemaining: number;
  expiry: Date | string;
  planAmount: string;
}


  export interface Payment{
    orderId: string,
    amount: string
    status: string
  }
export interface IRefeshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt?: Date;
}
export interface IRefreshWithPopulatedData extends Document {
  userId: IUserWithID;
  token: string;
}

export interface ICloudinaryAdapter {
  upload(path: string): Promise<string>;
}
