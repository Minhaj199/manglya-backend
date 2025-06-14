import { Types } from "mongoose";
import {  IMessage, IMessageWithoutId } from "../../types/TypesAndInterfaces.ts";


export interface IMessageRepository{
    create(data:IMessageWithoutId):Promise<IMessage>
    findMessages(chatRoomId:string):Promise<IMessage[]|[]>
    updateReadedMessage(id:string):Promise<void>
    updatAllMessagesReaded(ids:string[]):Promise<boolean>
    findAllMessage(chatRoomId: string): Promise<IMessage[] | []>
    findNewMessages(userId: string, partnerIds: string[]): Promise<{
    _id: string[];
    count: number;
    userId: Types.ObjectId[];
}[]>
    

}