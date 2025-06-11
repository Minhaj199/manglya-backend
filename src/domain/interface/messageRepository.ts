import {  IMessage, IMessageWithoutId, Messages } from "../../types/TypesAndInterfaces.ts";


export interface MessageRepositoryInterface{
    create(data:IMessageWithoutId):Promise<IMessage>
    findMessages(chatRoomId:string):Promise<IMessage[]|[]>
    updateReadedMessage(id:string):Promise<void>
    updatAllMessagesReaded(ids:string[]):Promise<boolean>
    findAllMessage(chatRoomId: string): Promise<IMessage[] | []>
    

}