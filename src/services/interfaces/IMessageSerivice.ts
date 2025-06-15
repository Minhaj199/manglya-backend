
import { Types } from "mongoose";
import { FindNewMessagesReturn, IChatMessage, IMessage, IMessageWithoutId } from "../../types/TypesAndInterfaces";

export interface IMessageService {
  createMessage(data: IMessageWithoutId): Promise<IMessage>;
  findAllMessage(id: string): Promise<IChatMessage[]>;
  updateReadedMessage(id: string): Promise<void>;
  fetchMessageCount(
    from: unknown,
    id: unknown
  ): Promise<{ count: number; ids: string[] }>;
  makeAllUsersMessageReaded(from: unknown, ids: string[]): Promise<boolean>;
  createImageUrl(path: string): Promise<string>;
  findNewMessages(id: unknown): Promise<FindNewMessagesReturn[]>
  messageCount(userID: unknown, from: unknown): Promise<{
    newMessagesForNav: {
        count: number;
        ids: string[];
    };
    newMessagesNotifiation: {
        _id: string[];
        count: number;
        userId: Types.ObjectId[];
    }[];
}|{ count: 0 }>
}
