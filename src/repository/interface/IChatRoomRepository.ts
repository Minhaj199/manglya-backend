

import { IChatRoom, IChatRoomInput, IFetchedChat } from "../../types/TypesAndInterfaces.ts";



export interface IChatRepository{
    create(data:IChatRoomInput):Promise<IChatRoom>
    findChatRoomWithIDs(user1:string,user2:string):Promise<IChatRoom|null>
    findChatRoomWithID(id:string):Promise<IFetchedChat|null>,
    fetchDatasForCount(id:string):Promise<{ chats: { _id: string; } }[]|[]>
}