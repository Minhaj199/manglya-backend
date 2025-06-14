import { Types } from "mongoose";
import { IChatMessage, IMessage, IMessageWithoutId } from "../../types/TypesAndInterfaces";

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
  findNewMessages(id: unknown): Promise<{
    _id: string[];
    count: number;
    userId: Types.ObjectId[];
}[]>
}
