import { Types } from "mongoose";
import {  IMessage, IMessageRow, IMessageWithoutId } from "../../types/TypesAndInterfaces.ts";


export interface IMessageRepository{
    create(data:IMessageWithoutId):Promise<IMessageRow>
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