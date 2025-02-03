import { Types } from "mongoose"
import { MessageRepositoryInterface } from "../../domain/interface/messageRepository.js"
import { IMessage } from "../../types/TypesAndInterfaces.js"
import { messageModel } from "../db/messageModel.js"
import BaseRepository from "./baseRepository.js"

export class MessageRepository extends BaseRepository<IMessage>implements MessageRepositoryInterface{
    constructor(){
      super(messageModel)
    }
    async findMessages(chatRoomId:unknown):Promise<IMessage[]|[]>{
      if(typeof chatRoomId!=='string'){
        throw new Error('interanal server error on message fetching')
      }
      try {
        const data=await this.model.find({chatRoomId}).sort({createdAt:1}) 
        return data
      } catch (error:any) {
        throw new Error(error.message||'internal server error')
      }
    }
    async findAllMessage(chatRoomId:string):Promise<IMessage[]|[]>{
      try {
       return await messageModel.find({chatRoomId:chatRoomId},{_id:0,text:1,createdAt:1,receiverId:1,image:1}).sort({createdAt:1})
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    async updateReadedMessage(id: string): Promise<void> {
      try {
        await this.model.updateMany({chatRoomId:new Types.ObjectId(id)},{viewedOnNav:true,viewedList:true})      
      } catch (error:any) {
        throw new Error(error.message)
      }
      
    
    }
    
    async updatAllMessagesReaded(ids: string[]): Promise<boolean> {
      if(!Array.isArray(ids)||ids?.length<0){
        return true
      }
      try {
       const data= await this.model.updateMany({_id:ids},{viewedOnNav:true})
      return true
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    async findNewMessages(userId:string,partnerIds:string[]){
      if(partnerIds?.length<=0){
        return []
      }
     
     
     const parsedIds=partnerIds.map(el=>new Types.ObjectId(el))
      try {
        const result:{ _id:string[ ], count: number,userId:Types.ObjectId[] }[]=await this.model.aggregate([{$match:{viewedOnNav:false,viewedList:false,receiverId:new Types.ObjectId (userId),senderId:{$in:parsedIds}}},{$lookup:{from:'users',localField:'senderId',foreignField:'_id',as:"info"}}
          ,{$project:{_id:0,name:'$info.PersonalInfo.firstName',userId:'$info._id',createdAt:1}},{$group:{_id:'$name',userId:{$push:'$userId'},count:{$sum:1}}},{$project:{count:1,_id:0,userId:{$arrayElemAt:["$userId",0]},name:{$arrayElemAt: ["$_id",0]}}},
          {$project:{count:1,_id:0,userId:{$toString:{$arrayElemAt:["$userId",0]}},name:1}}


        ])

        return result
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
  }