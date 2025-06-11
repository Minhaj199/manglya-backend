import { UserRepository } from "../../domain/interface/userRepository.ts";
import {   adminPlanType, LandingShowUesrsInterface, PlanOrdersEntity, RequestInterface, suggestionType, updateData, UserCurrentPlan, UserWithID } from "../../types/TypesAndInterfaces.ts";
import {  Types,UpdateWriteOpResult } from "mongoose";
import { planOrderModel } from "../db/planOrder.ts";
import { PlanOrder } from "../../types/TypesAndInterfaces.ts";
import { MatchedProfile, profileTypeFetch, userForLanding } from "../../types/TypesAndInterfaces.ts";
import { getDateFromAge } from "../../interface/utility/getDateFromAge.ts";
import BaseRepository from "./baseRepository.ts";
import { objectIdToString } from "../../interface/utility/objectIdToString.ts";
import { IUserModel, UserModel } from "../db/userModel.ts";



export class UserRepsitories extends BaseRepository<UserWithID>implements UserRepository {
  constructor(){
  super(UserModel)
  }
  
  async findByEmail(email: string): Promise<UserWithID | null> {
    try {
      const user = await this.model.findOne({ email, block: false }).lean();

      return user as UserWithID | null;
    } catch (error:any) {
      throw new Error(error.message||'errro occured on email fetching')
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
    } catch (error: any) {
      throw new Error(error.message||'error on message')
     
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
    } catch (error: any) {
      throw new Error(error.message||'error on interest adding')
    }
  }
  async addMatch(userId: unknown, matchedId: string,user:UserWithID): Promise<boolean> {
   
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
        } catch (error) {
          throw new Error("error on manage Request");
        }
      } else {
        throw new Error("error on manage request");
      }
    } catch (error) {
      throw new Error("error on manage request");
    }
  }
  async getUsers(): Promise<LandingShowUesrsInterface[]|[]> {
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
      
      
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "error on getting new added data");
    }
  }
  async getSearch(data: string,gender:string, preferedGender:string): Promise<profileTypeFetch | []> {
  
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
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message)
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
    } catch (error:any) {
      throw new Error(error.message||'error on email fetching')
    }
  }
  async getUserProfile(id: string): Promise<UserWithID> {
   
    try {
      const user:unknown=await UserModel.findOne({_id:id}).lean()
      if(user){
        return user as UserWithID 
      }else{
        throw new Error('user not found')
      }
    } catch (error:any) {
      
      console.log(error)
      throw new Error(error.message||'error on profile fetching')
    }
  }
  async update(user: updateData,id:string): Promise<UserWithID> {

    try {
      const response:unknown=await UserModel.findOneAndUpdate({_id:new Types.ObjectId (id)},{$set:user}, { new: true })   
      if(response){
        return response as UserWithID
      }else{
        throw new Error('not updated')
      }  
    } catch (error:any) {
    
      throw new Error(error.message||'error on update')
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
    } catch (error:any) {
      throw new Error(error.message)
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
  async getMatchedRequest(id: string):Promise<MatchedProfile[]|[]> {
    const cropedId=id
    
    
   
    try {
      const profiles=await UserModel.aggregate([{$match:{_id:new Types.ObjectId(cropedId)}},{$project:{match:1,_id:0}},{$unwind:'$match'},
       {$lookup:{from:'users',localField:'match._id',foreignField:'_id',as:'datas'}},{$unwind:'$datas'},{$match:{'match.status':'accepted'}},
       {$project:{_id:'$datas._id',photo:'$datas.PersonalInfo.image',firstName:'$datas.PersonalInfo.firstName',secondName:'$datas.PersonalInfo.secondName',state:'$datas.PersonalInfo.state',dateOfBirth:'$datas.PersonalInfo.dateOfBirth'}}
     
      ])
      
      return profiles
    } catch (error:any) {
      throw new Error(error.message||'error on Fetching profile-MngRepos')
    }
  }
  async deleteMatched(id: string, matched: string): Promise<boolean> {
    try {
      const response:{acknowledged:boolean,modifiedCount:number,matchedCount:number}=await UserModel.updateOne({_id:new Types.ObjectId(id)},{$pull:{match:{_id:matched}}})
      const response2:{acknowledged:boolean,modifiedCount:number,matchedCount:number}=await UserModel.updateOne({_id:new Types.ObjectId(matched)},{$pull:{match:{_id:id}}})
     if(response&&response.acknowledged&&response.modifiedCount===1){

          return true
        }else{
          throw new Error('not deleted')
        }
    } catch (error:any) {
   
      throw new Error(error.message||'error on deletion')
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
    } catch (error:any) {
      throw new Error(error.message||'error on password reset')
    }
  }
  async fetchPartnerProfils(userId: string, userGender: string, partnerGender: string): Promise<{ profile: profileTypeFetch; request: profileTypeFetch; }[]> {
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
   } catch (error:any) {
    throw new Error(error.message||'error on fetching')
   }
    
  }
  async getCurrentPlan(userId: string): Promise<{CurrentPlan:UserCurrentPlan}[]|[]> {
 
    try {
      const response:{CurrentPlan:UserCurrentPlan}[]|[]= await this.model.aggregate([{$match:{_id:new Types.ObjectId(userId)}},{$project:{_id:0,CurrentPlan:1}}])
  
      return response
    } catch (error:any) {
      throw new Error(error.message)
    }
    
  }
  async addPurchaseData(planId: string, id: string, data: PlanOrder):Promise<boolean>{
    try {
      const result:any= await this.model.updateOne(
        { _id: new Types.ObjectId(id) },
        {$push:{PlanData: planId} ,$set:{ subscriber: "subscribed", CurrentPlan: data} }
      ); 
     
      if(result){
        return true
      }else{
        throw new Error('internal server error')
      }
    } catch (error:any) {
      console.log(error)
      throw new Error(error.message||'internal server error')
    }
  }
 async fetchSuggetions(id: string,gender:string,partnerPreference:string): Promise<{ profile: suggestionType[]|[] ; request: profileTypeFetch|[] ; userProfile: IUserModel[]|[]}[]> {
  
  try {
        const datas:{profile:suggestionType[]|[],request:profileTypeFetch|[],userProfile:IUserModel[]|[]}[]=await UserModel.aggregate([{
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
      } catch (error:any) {
        throw new Error(error.message)
      }
 }
 async findEmail(email: string): Promise<UserWithID | null> {
   try {
     return await UserModel.findOne({email:email})
   } catch (error:any) {
    throw new Error(error.message)
   }
 }
 async createRequest(id: string): Promise<RequestInterface[]> {
 
  try {
    const user=await UserModel.aggregate([{$match:{_id:new Types.ObjectId(id)}},
        {$project:{_id:'$_id',photo:'$PersonalInfo.image',name:'$PersonalInfo.firstName'}}])
        if(user){
            return {...user[0]}    
        }else{
            throw new Error('user not found')
        }
} catch (error:any) {
    throw new Error(error.message||'error on request injection')
}
 }
 async makePlanExpire(){
  try {
    const currentDate=new Date()
   
    const response=await this.model.updateMany({subscriber:'subscribed','CurrentPlan.Expiry':{$lte:currentDate}},{$set:{subscriber:'expired','CurrentPlan':[]}})
    
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
} catch (error){
    return 'name'
}
 }
 async fetchUserDataForAdmin(){
  try {
    return await this.model.aggregate([{$sort:{_id:-1}},{$project:{username:'$PersonalInfo.firstName',email:1,match:1,subscriber:1,CreatedAt:1,block:1}}])
  } catch (error:any) {
    throw new Error(error.message)
  }
 }
 async fetchSubscriber():Promise<adminPlanType[]|[]>{
  try {
    const data:adminPlanType[]|[]=await this.model.aggregate([{$match:{$or:[{subscriber:'subscribed'},{subscriber:
      'connection finished'}]}},{$match:{'CurrentPlan.name':{$exists:true}}},
      {$project:{_id:0,username:'$PersonalInfo.firstName',
      planName:'$CurrentPlan.name',MatchCountRemaining:'$CurrentPlan.avialbleConnect',expiry:'$CurrentPlan.Expiry',planAmount:'$CurrentPlan.amount'}}
  ])
  return data
  } catch (error:any) {
    throw new Error(error.message)  
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
  } catch (error:any) {
    throw new Error(error.message)
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
    } catch (error:any) {
      throw new Error(error.message)
    }
 }
 async findCurrentPlanAndRequests(id:string){
  try {
    const response:{request:{_id:string,status:string,typeOfRequest:string}[],currertPlan:{CurrentPlan:PlanOrdersEntity}[]}[]=await this.model.aggregate([{$facet:{request:[{$match:{_id:new Types.ObjectId(id)}},{$project:{match:1,_id:0}},{$unwind:'$match'},{$match:{'match.typeOfRequest':'send'}},{$replaceRoot:{newRoot:'$match'}},{$lookup:{from:'users',localField:'_id',foreignField:'_id',as:'info'}},{$project:{status:'$status',typeOfRequest:'$typeOfRequest',name:{ $arrayElemAt: ["$info.PersonalInfo.firstName", 0] }}}],currertPlan:[{$match:{_id:new Types.ObjectId(id)}},{$project:{CurrentPlan:1,_id:0}}]}},])
    
   
     return {request:response[0].request||[],plan:(response[0]?.currertPlan[0].CurrentPlan)?response[0]?.currertPlan[0].CurrentPlan:[]}
  } catch (error:any) {
    throw new Error(error.message)
  }

 }
}




















