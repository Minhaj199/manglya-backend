import { Types } from "mongoose"
import { ChatRepository } from "../../domain/interface/chatRoomRepository.js"
import { ChatRoom, FetchedChat, Member } from "../../types/TypesAndInterfaces.js"
import { chatModel } from "../db/chatModel.js"
import BaseRepository from "./baseRepository.js"

export class ChatRoomRepository extends BaseRepository<ChatRoom> implements ChatRepository{
    constructor(){
      super(chatModel)
    }
    async findChatRoomWithIDs(user1:string,user2:string):Promise<ChatRoom|null>{
      try {
      const result =await this.model.findOne({
            members :{$all:[new Types.ObjectId(user1),new Types.ObjectId(user2)]}
         })
     
        return result
       
      } catch (error:any) {
        throw new Error(error.message||'error on chat fetching')
      }
    }
    async findChatRoomWithID(id: string): Promise<FetchedChat|null> {
  
      try {
        return await this.model.findOne({id}).populate<{members:Member[]}>('members','PersonalInfo.firstName PersonalInfo.image')
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    async fetchDatasForCount(id: string): Promise<{ chats: { _id: string; } }[]|[]> {
      try {
        const response:{chats:{_id:string}}[]|[]=await chatModel.aggregate(
          [{$match:{members:{$in:[new Types.ObjectId(id)]}}},{$lookup:{from:'messages',localField:'_id',foreignField:'chatRoomId',as:'chats'}}
          ,{$project:{_id:0,chats:1}},{$unwind:'$chats'},{$match:{$and:[{'chats.viewedOnNav':false},{'chats.viewedList':false},{'chats.receiverId':new Types.ObjectId(id)}]}},{$project:{'chats._id':1}}]
      )

        return response
      
      } catch (error:any) {
          throw new Error()
      }
      
  }
  }