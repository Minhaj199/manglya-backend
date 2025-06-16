/* eslint-disable @typescript-eslint/no-explicit-any */


//////////////any to be removed from ////////////findCurrentPlanAndRequests
import { IUserRepository} from "../interface/IUserRepository.ts";
import {  Types,UpdateWriteOpResult } from "mongoose";
import { planOrderModel } from "../../models/planOrderModel.ts";
import { getDateFromAge } from "../../utils/getDateFromAge.ts";
import BaseRepository from "./baseRepository.ts";
import { objectIdToString } from "../../utils/objectIdToString.ts";
import {  UserModel } from "../../models/userModel.ts";
import { ILandingShowUesrsInterface, IUserWithID, UpdatedData } from "../../types/UserRelatedTypes.ts";
import { CurrentPlanType, IAdminPlanType, IMatchedProfileType, IPlanOrder, IProfileTypeFetch, IRequestInterface, ISuggestion, IUserCurrentPlan } from "../../types/TypesAndInterfaces.ts";




export class UserRepsitories extends BaseRepository<IUserWithID>implements IUserRepository {
  constructor(){
  super(UserModel)
  }
  
  async findByEmail(email: string): Promise<IUserWithID | null> {
    try {
      const user = await this.model.findOne({ email, block: false }).lean();

      return user as IUserWithID | null;
    }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
   
  }
  async addPhoto(photo: string, email: string): Promise<boolean> {
    
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.image": photo } }
      );
      
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async addInterest(interst: string[], email: string): Promise<boolean> {
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.interest": interst } }
      );
      if(result){
        return true;
      }else{
        return false
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async addMatch(userId: unknown, matchedId: string,user:IUserWithID): Promise<boolean> {
   
    if(typeof userId==='string'){

      if (userId && matchedId) {
          const userMatchId = new Types.ObjectId(matchedId);
          const userID = new Types.ObjectId(userId);  
          try {
        if (user?.CurrentPlan&&user.CurrentPlan.avialbleConnect === 1) {
                    
          const result = await UserModel.bulkWrite([
            {
              updateOne: {
                filter: { _id: userId,match: { $not: { $elemMatch: { _id: userMatchId } } } },
                update: {
                  $addToSet: {
                    match: { _id: userMatchId, typeOfRequest: "send" },
                  },
                },
              },
            },
            {
              updateOne: {
                filter: { _id: userId , match: { $not: { $elemMatch: { _id: userMatchId } } }},
                update: { $set: { subscriber: "connection finished" } },
              },
            },
            {
              updateOne: {
                filter: { _id: userId },
                update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
              },
            },
            {
              updateOne: {
                filter: { _id: matchedId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                update: {
                  $addToSet: {
                    match: { _id: userID, typeOfRequest: "recieved" },
                  },
                },
              },
            },
          ]);
          if (result) {
            return true;
          }
        } else if (user?.CurrentPlan&&user.CurrentPlan.avialbleConnect > 1) {
          const result = await UserModel.bulkWrite([
            {
              updateOne: {
                filter: { _id: userId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                update: {
                  $addToSet: {
                    match: { _id: userMatchId, typeOfRequest: "send" },
                  },
                },
              },
            },
            {
              updateOne: {
                filter: { _id: userId },
                update: { $inc: { "CurrentPlan.avialbleConnect": -1 }},
              },
            },
            {
              updateOne: {
                filter: { _id: matchedId, match: { $not: { $elemMatch: { _id: userId } } } },
                update: {
                  $addToSet: {
                    match: { _id: userID, typeOfRequest: "recieved" },
                  },
                },
              },
            },
          ]);
          if (result) {
            return true;
          }else{
            throw new Error('Error on Request sending')
          }
        } else {
            throw new Error('Connection count over')
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    } else {
      return false;
    }
    return false;
  }
  async manageReqRes(
    requesterId: string,
    userId: unknown,
    action: string
  ): Promise<boolean> {
    try {
    
      if (action === "accept"&&typeof userId==='string') {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          
          const response=await UserModel.bulkWrite([
            {
              updateOne:{
                filter:{_id: convertedUserID,"match._id": convertedReqID},
                update:{ $set: { "match.$.status": "accepted" }}

              }
            },
            {
              updateOne:{
                filter:{_id: convertedReqID,"match._id": convertedUserID},
                update:{ $set: { "match.$.status": "accepted" }}

              }
            }
          ])
          if(response){
            return true
          }else{
            return true;
          }
        } catch (error) {
          console.log(error);
          throw new Error("error on manage Request");
        }
      } else if (action === "reject"&&typeof userId==='string') {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);
          
          const response=await UserModel.bulkWrite([
            {
              updateOne:{
                filter:{_id: convertedUserID,"match._id": convertedReqID,'match.status':'pending'},
                update:{ $set: { "match.$.status": "rejected" }}

              }
            },
            {
              updateOne:{
                filter:{_id: convertedReqID,"match._id": convertedUserID,'match.status':'pending'},
                update:{ $set: { "match.$.status": "rejected" }}

              }
            }
          ])
          if(response){

            return true;
          }else{
            return false
          }
        } catch {
          throw new Error("error on manage Request");
        }
      } else {
        throw new Error("error on manage request");
      }
    } catch  {
      throw new Error("error on manage request");
    }
  }
  async getUsers(): Promise<ILandingShowUesrsInterface[]|[]> {
    try {
      const data = (await UserModel.aggregate([
        {
          $facet: {
            boys: [
              {$match:{'PersonalInfo.image':{$exists:true}}},
              { $match: { "PersonalInfo.gender": "male" } },
              { $sort: { _id: -1 } },
              { $limit:2 },
            ],
            girls: [
              {$match:{'PersonalInfo.image':{$exists:true}}},
              { $match: { "PersonalInfo.gender": "female" } },
              { $sort: { _id: -1 } },
              { $limit: 2 },
            ],
          },
        },
        { $project: { combined: { $concatArrays: ["$boys", "$girls"] } } },
        { $unwind: "$combined" },
        { $replaceRoot: { newRoot: "$combined" } },
        {
          $project: {
            _id: 0,
            name: "$PersonalInfo.firstName",
            secondName: "$PersonalInfo.secondName",
            place: "$PersonalInfo.state",
            age: "$PersonalInfo.dateOfBirth",
            image: "$PersonalInfo.image",
          },
        },
      ])) as { name: string; secondName: string; age: Date; image: string }[];
      if(data.length){

        return data
      }else{
        return []
      }
      
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async getSearch(data: string,gender:string, preferedGender:string): Promise<IProfileTypeFetch | []> {
  
    try {
      const datas:{ minAge:number, maxAge: number, district: string, interest:string[]}=JSON.parse(data)
      if(datas.minAge>datas.maxAge){
        throw new Error('please enter a valid range')
      }
      const dates=getDateFromAge(datas.minAge,datas.maxAge)
      if(datas.district&&datas.interest.length!==0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},{'PersonalInfo.state':datas.district},{'PersonalInfo.interest':{$all:datas.interest}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        ])
        return responseDB
      }
      else if(!datas.district&&datas.interest.length===0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        
        ])
        
        return responseDB
      }else if(datas.district){
        
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},
          {'PersonalInfo.state':datas.district}
        ]}},
        {$project:{name:'$PersonalInfo.firstName',
          lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
              state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
              dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
              photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
      ])
        
        return responseDB
      }else if(datas.interest.length!==0){
        const responseDB:any=await UserModel.aggregate([{$match:{$and:[{'PersonalInfo.gender':preferedGender},{'partnerData.gender':gender},{'PersonalInfo.dateOfBirth':{$lte:dates.minAgeDate,$gte:dates.maxAgeDate}},{'PersonalInfo.interest':{$all:datas.interest}}]}},
          {$project:{name:'$PersonalInfo.firstName',
            lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}
        ])
        return responseDB
      }
      throw new Error('Error on search ')
    }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async findEmailByID(id: unknown): Promise<{email:string}> {
    try {
      
      if(!id||typeof id!=='string'){
        throw new Error('id not found')
      }
      const changedId=id as string
      const email:{email:string}|null=await UserModel.findById(changedId,{_id:0,email:1})
      if(email?.email){
        return email
      }
      throw new Error('email not found')
    }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async getUserProfile(id: string): Promise<IUserWithID> {
   
    try {
      const user:unknown=await UserModel.findOne({_id:id}).lean()
      if(user){
        return user as IUserWithID 
      }else{
        throw new Error('user not found')
      }
    }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async update(user: UpdatedData,id:string): Promise<IUserWithID> {

    try {
      const response:unknown=await UserModel.findOneAndUpdate({_id:new Types.ObjectId (id)},{$set:user}, { new: true })   
      if(response){
        return response as IUserWithID
      }else{
        throw new Error('not updated')
      }  
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async getRevenue(): Promise<{ _id:string, total: number }[]> {
    
    const result=await planOrderModel.aggregate([{$group:{_id:{'$dateToString':{format: "%Y-%m-%d", date: "$created"}},total:{$sum:'$amount'}}},
      {$sort:{_id:-1}},
      {$limit:7}
    ])
    
    return result
  }
  async getSubcriberCount(): Promise<{_id:string,count:number}[]> {
    try {
      const data:{_id:string,count:number}[]=await UserModel.aggregate([{$group:{_id:'$subscriber',count:{$sum:1}}}])
      
     return data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
   
  }
  async getDashCount(): Promise<{subscriberGroups:{ _id:string, count:number}[],totalCount:number}> {
    const data:{ totalCount:{totalCount:number}[],subscriberGroups:{ _id:string, count:number}[]}[]
     = await UserModel.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "totalCount" }], 
          subscriberGroups: [
            {
              $group: {
                _id: "$subscriber", 
                count: { $sum: 1 } 
              }
            }
          ]
        }
      }
    ])
    
    return {subscriberGroups:data[0].subscriberGroups,totalCount:data[0].totalCount[0].totalCount}
  }
  async getMatchedRequest(id: string):Promise<IMatchedProfileType[]|[]> {
    const cropedId=id
    
    
   
    try {
      const profiles=await UserModel.aggregate([{$match:{_id:new Types.ObjectId(cropedId)}},{$project:{match:1,_id:0}},{$unwind:'$match'},
       {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'datas'}},{$unwind:'$datas'},{$match:{'match.status':'accepted'}},
       {$project:{_id:'$datas._id',photo:'$datas.PersonalInfo.image',firstName:'$datas.PersonalInfo.firstName',secondName:'$datas.PersonalInfo.secondName',state:'$datas.PersonalInfo.state',dateOfBirth:'$datas.PersonalInfo.dateOfBirth'}}
     
      ])
      return profiles
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async deleteMatched(id: string, matched: string): Promise<boolean> {
    try {
      const response:{acknowledged:boolean,modifiedCount:number,matchedCount:number}=await UserModel.updateOne({_id:new Types.ObjectId(id)},{$pull:{match:{_id:matched}}})
      await UserModel.updateOne({_id:new Types.ObjectId(matched)},{$pull:{match:{_id:id}}})
     if(response&&response.acknowledged&&response.modifiedCount===1){

          return true
        }else{
          throw new Error('not deleted')
        }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async changePassword(email: string, hashedPassword: string): Promise<boolean> {
    try {
      const response=await UserModel.updateOne({email:email},{password:hashedPassword})
      if(response){
        return true
      }else{
        return false
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchPartnerProfils(userId: string, userGender: string, partnerGender: string): Promise<{ profile: IProfileTypeFetch; request: IProfileTypeFetch; }[]> {
   try {
    return this.model.aggregate([{
      $facet:{
          profile:[{$match:{$and:[{'PersonalInfo.gender':partnerGender},{'partnerData.gender':userGender},{match:{$not:{$elemMatch:{_id:new Types.ObjectId(userId)}}}},{_id:{$ne:new Types.ObjectId(userId)}}]}},{$project:{name:'$PersonalInfo.firstName',
          lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
              state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
              dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
              photo:'$PersonalInfo.image',match:'$match'}},{$sort:{_id:-1}}],
          request:[{$match:{_id:new Types.ObjectId(userId)}},{$unwind:'$match'},{$match:{'match.status':'pending','match.typeOfRequest':'recieved'}},
              {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'matchedUser'}},{$unwind:'$matchedUser'},{$project:{_id:0,matchedUser:1}},
          {$project:{_id:'$matchedUser._id',name:'$matchedUser.PersonalInfo.firstName',
          lookingFor:'$matchedUser.partnerData.gender',secondName:'$matchedUser.PersonalInfo.secondName',
          state:'$matchedUser.PersonalInfo.state',gender:'$matchedUser.PersonalInfo.gender',
          dateOfBirth:'$matchedUser.PersonalInfo.dateOfBirth',interest:'$matchedUser.PersonalInfo.interest',
          photo:'$matchedUser.PersonalInfo.image'}},{$sort:{_id:-1}}]
      }
  }])
   } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
     
  }
  async getCurrentPlan(userId: string): Promise<{CurrentPlan:IUserCurrentPlan}[]|[]> {
    try {
      const response:{CurrentPlan:IUserCurrentPlan}[]|[]= await this.model.aggregate([{$match:{_id:new Types.ObjectId(userId)}},{$project:{_id:0,CurrentPlan:1}}])

      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async addPurchaseData(planId: string, id: string, data: IPlanOrder):Promise<boolean>{
    try {
      const result:unknown= await this.model.updateOne(
        { _id: new Types.ObjectId(id) },
        {$push:{PlanData: planId} ,$set:{ subscriber: "subscribed", CurrentPlan: data} }
      ); 
     
      if(result){
        return true
      }else{
        throw new Error('internal server error')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
 async fetchSuggetions(id: string,gender:string,partnerPreference:string): Promise<{ profile: ISuggestion[]|[] ; request: IProfileTypeFetch|[] ; userProfile: IUserWithID[]|[]}[]> {
  
  try {
        const datas:{profile:ISuggestion[]|[],request:IProfileTypeFetch|[],userProfile:IUserWithID[]|[]}[]=await UserModel.aggregate([{
          $facet:{
              profile:[{$match:{$and:[{'PersonalInfo.gender':partnerPreference},{'partnerData.gender':gender},{_id:{$ne:new Types.ObjectId(id)}},{match:{$not:{$elemMatch:{_id:new Types.ObjectId(id)}}}}]}},{$project:{name:'$PersonalInfo.firstName',
              lookingFor:'$partnerData.gender',secondName:'$PersonalInfo.secondName',
                  state:'$PersonalInfo.state',gender:'$PersonalInfo.gender',
                  dateOfBirth:'$PersonalInfo.dateOfBirth',interest:'$PersonalInfo.interest',
                  photo:'$PersonalInfo.image',match:'$match',subscriber:'$subscriber',planFeatures:'$CurrentPlan.features'}},{$sort:{_id:-1}}],
              request:[{$match:{_id:new Types.ObjectId(id)}},{$unwind:'$match'},{$match:{'match.status':'pending','match.typeOfRequest':'recieved'}},
                  {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'matchedUser'}},{$unwind:'$matchedUser'},{$project:{_id:0,matchedUser:1}},
              {$project:{_id:'$matchedUser._id',name:'$matchedUser.PersonalInfo.firstName',
              lookingFor:'$matchedUser.partnerData.gender',secondName:'$matchedUser.PersonalInfo.secondName',
              state:'$matchedUser.PersonalInfo.state',gender:'$matchedUser.PersonalInfo.gender',
              dateOfBirth:'$matchedUser.PersonalInfo.dateOfBirth',interest:'$matchedUser.PersonalInfo.interest',
              photo:'$matchedUser.PersonalInfo.image'}},{$sort:{_id:-1}}],
              userProfile:[{$match:{_id:new Types.ObjectId(id)}}]
          }
      }]) 
        
      return datas 
      } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async findEmail(email: string): Promise<IUserWithID | null> {
   try {
     return await UserModel.findOne({email:email})
   }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async createRequest(id: string): Promise<IRequestInterface[]> {
 
  try {
    const user=await UserModel.aggregate([{$match:{_id:new Types.ObjectId(id)}},
        {$project:{_id:'$_id',photo:'$PersonalInfo.image',name:'$PersonalInfo.firstName'}}])
        if(user){
            return {...user[0]}    
        }else{
            throw new Error('user not found')
        }
}  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async makePlanExpire(){
  try {
    const currentDate=new Date()
   
    await this.model.updateMany({subscriber:'subscribed','CurrentPlan.Expiry':{$lte:currentDate}},{$set:{subscriber:'expired','CurrentPlan':[]}})
    
  } catch (error) {
    console.log(error)
  }
 }
 async fetchName(id: string): Promise<string> {
  try {
    const name:{PersonalInfo:{firstName:string}}|null=await UserModel.findById(id,{_id:0,'PersonalInfo.firstName':1})
        if(name?.PersonalInfo.firstName){
            return name?.PersonalInfo.firstName
        }else{
            return 'name'
        }
}  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async fetchUserDataForAdmin(){
  try {
    return await this.model.aggregate([{$sort:{_id:-1}},{$project:{username:'$PersonalInfo.firstName',email:1,match:1,subscriber:1,CreatedAt:1,block:1}}])

  }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async fetchSubscriber():Promise<IAdminPlanType[]|[]>{
  try {
    const data:IAdminPlanType[]|[]=await this.model.aggregate([{$match:{$or:[{subscriber:'subscribed'},{subscriber:
      'connection finished'}]}},{$match:{'CurrentPlan.name':{$exists:true}}},
      {$project:{_id:0,username:'$PersonalInfo.firstName',
      planName:'$CurrentPlan.name',MatchCountRemaining:'$CurrentPlan.avialbleConnect',expiry:'$CurrentPlan.Expiry',planAmount:'$CurrentPlan.amount'}}
  ])
  return data
  }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async blockAndUnblockUser(id:string,action:boolean): Promise<boolean> {
   try {
    const response:UpdateWriteOpResult=await this.model.updateOne({_id:new Types.ObjectId(id)},{$set:{block:action}})
    if(response.acknowledged){
      return true
    }else{
      return false
    }
  } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 async findPartnerIds(id:string){
    try {
      const result:{ match: { _id:Types.ObjectId }}[] =await this.model.aggregate([{$match:{_id:new Types.ObjectId(id)}},{$project:{_id:0,match:1}},{$unwind:'$match'},{$match:{'match.status':'accepted'}},{$project:{'match._id':1}}])
      let finalResult:string[]=[]
      if(result?.length>0){
        finalResult=result?.map(el=>{
          return objectIdToString(el.match._id)
        })
      
      }
      return finalResult
    }  catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
 }
 


 async findCurrentPlanAndRequests(id:string){
  try {
    const response:CurrentPlanType[]=await this.model.aggregate([{$facet:{request:[{$match:{_id:new Types.ObjectId(id)}},{$project:{match:1,_id:0}},{$unwind:'$match'},{$match:{'match.typeOfRequest':'send'}},{$replaceRoot:{newRoot:'$match'}},{$lookup:{from:'users',localField:'_id',foreignField:'_id',as:'info'}},{$project:{status:'$status',typeOfRequest:'$typeOfRequest',name:{ $arrayElemAt: ["$info.PersonalInfo.firstName", 0] }}}],currertPlan:[{$match:{_id:new Types.ObjectId(id)}},{$project:{CurrentPlan:1,_id:0}}]}},])

   const data={request:response[0].request||[],plan:(response[0]?.currertPlan[0].CurrentPlan)?response[0]?.currertPlan[0].CurrentPlan:[]}
     return data
  } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }

 }
}



