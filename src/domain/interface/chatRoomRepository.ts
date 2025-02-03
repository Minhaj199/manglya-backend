

import { ChatRoom, FetchedChat } from "../../types/TypesAndInterfaces.js";


export interface ChatRepository{
    create(data:ChatRoom):Promise<ChatRoom>
    findChatRoomWithIDs(user1:string,user2:string):Promise<ChatRoom|null>
    findChatRoomWithID(id:string):Promise<FetchedChat|null>,
    fetchDatasForCount(id:string):Promise<{ chats: { _id: string; } }[]|[]>
}