import {
  IChatRoom,
  IChatRoomInput,
  IFetchedChat,
} from "../../types/TypesAndInterfaces";

export interface IChatRepository {
  create(data: IChatRoomInput): Promise<IChatRoom>;
  fetchChatRoomWithIDs(user1: string, user2: string): Promise<IChatRoom | null>;
  fetchChatRoomWithID(id: string): Promise<IFetchedChat | null>;
  fetchDatasForCount(id: string): Promise<{ chats: { _id: string } }[] | []>;
}
