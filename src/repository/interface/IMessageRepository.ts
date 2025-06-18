import { Types } from "mongoose";
import {
  IMessage,
  IMessageRow,
  IMessageWithoutId,
} from "../../types/TypesAndInterfaces";

export interface IMessageRepository {
  create(data: IMessageWithoutId): Promise<IMessageRow>;
  fetchMessages(chatRoomId: string): Promise<IMessage[] | []>;
  updateReadedMessage(id: string): Promise<void>;
  updatAllMessagesReaded(ids: string[]): Promise<boolean>;
  fetchAllMessage(chatRoomId: string): Promise<IMessage[] | []>;
  fetchNewMessages(
    userId: string,
    partnerIds: string[]
  ): Promise<
    {
      _id: string[];
      count: number;
      userId: Types.ObjectId[];
    }[]
  >;
}
