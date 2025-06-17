import { Types } from "mongoose";
import { IChatRepository } from "../interface/IChatRoomRepository.ts";
import {
  IChatRoom,
  IFetchedChat,
  IMember,
} from "../../types/TypesAndInterfaces.ts";
import { chatModel } from "../../models/chatModel.ts";
import BaseRepository from "./baseRepository.ts";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain.ts";

export class ChatRoomRepository
  extends BaseRepository<IChatRoom>
  implements IChatRepository
{
  constructor() {
    super(chatModel);
  }
  async fetchChatRoomWithIDs(
    user1: string,
    user2: string
  ): Promise<IChatRoom | null> {
    try {
      const result = await this.model.findOne({
        members: {
          $all: [new Types.ObjectId(user1), new Types.ObjectId(user2)],
        },
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchChatRoomWithID(id: string): Promise<IFetchedChat | null> {
    try {
      return await this.model
        .findOne({ id })
        .populate<{ members: IMember[] }>(
          "members",
          "PersonalInfo.firstName PersonalInfo.image"
        );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchDatasForCount(
    id: string
  ): Promise<{ chats: { _id: string } }[] | []> {
    try {
      const response: { chats: { _id: string } }[] | [] =
        await chatModel.aggregate([
          { $match: { members: { $in: [new Types.ObjectId(id)] } } },
          {
            $lookup: {
              from: "messages",
              localField: "_id",
              foreignField: "chatRoomId",
              as: "chats",
            },
          },
          { $project: { _id: 0, chats: 1 } },
          { $unwind: "$chats" },
          {
            $match: {
              $and: [
                { "chats.viewedOnNav": false },
                { "chats.viewedList": false },
                { "chats.receiverId": new Types.ObjectId(id) },
              ],
            },
          },
          { $project: { "chats._id": 1 } },
        ]);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
