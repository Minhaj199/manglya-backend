

import { ChatRoom, ChatRoomInput, FetchedChat } from "../../types/TypesAndInterfaces.ts";


export interface IChatRepository{
    create(data:ChatRoomInput):Promise<ChatRoom>
    findChatRoomWithIDs(user1:string,user2:string):Promise<ChatRoom|null>
    findChatRoomWithID(id:string):Promise<FetchedChat|null>,
    fetchDatasForCount(id:string):Promise<{ chats: { _id: string; } }[]|[]>
}