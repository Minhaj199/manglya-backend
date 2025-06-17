import { IChatRepository } from "../../repository/interface/IChatRoomRepository.ts";
import { IMatchRepository} from "../../repository/interface/IUserRepository.ts";
import { IMessageService } from "../interfaces/IMessageSerivice.ts";
import {
  IChatMessage,
  ICloudinaryAdapter,
  IMessageWithoutId,
} from "../../types/TypesAndInterfaces.ts";
import { IMessageRepository } from "../../repository/interface/IMessageRepository.ts";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain.ts";
import { objectIdToString } from "../../utils/objectIdToString.ts";

export class MessageService implements IMessageService {
  
  constructor(
    private messageRepo: IMessageRepository,
  private chatRepositroy: IChatRepository,
  private photoCloud: ICloudinaryAdapter,
  private matchRepo: IMatchRepository,
  
  ) {
    
  }
  async createMessage(data: IMessageWithoutId) {
    try {
      return this.messageRepo.create(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async findAllMessage(id: string) {
    try {
      const get_All_Messages = await this.messageRepo.fetchAllMessage(id);
      if (get_All_Messages?.length > 0) {
        const final: IChatMessage[] = get_All_Messages.map((message) => {
          return {
            senderId: message.receiverId,
            text: message.text,
            image: message.image,
            createdAt: message.createdAt,
          };
        });
        await this.updateReadedMessage(id);
        return final;
      }
      await this.updateReadedMessage(id);
      return get_All_Messages;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async updateReadedMessage(id: string) {
    try {
      await this.messageRepo.updateReadedMessage(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchMessageCount(from: unknown, id: unknown) {
    try {
      if (typeof from === "string" && typeof id === "string") {
        const response = await this.chatRepositroy.fetchDatasForCount(id);

        if (response.length >= 1) {
          const ids: string[] = [];
          response.forEach((el) => {
            ids.push(el.chats._id);
          });
          if (ids.every((el) => typeof el === "string")) {
            return { count: ids.length, ids: ids };
          } else {
            return { count: ids.length, ids: [] };
          }
        } else {
          return { count: 0, ids: [] };
        }
      } else {
        throw new Error("error id type missmatch");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async makeAllUsersMessageReaded(from: unknown, ids: string[]) {
    try {
      if (typeof from === "string") {
        if (from === "nav") {
          await this.messageRepo.updatAllMessagesReaded(ids);

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async createImageUrl(path: string) {
    try {
      const response = await this.photoCloud.upload(path);
      if (typeof response === "string") {
        return response;
      } else {
        return "";
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async findNewMessages(id: unknown) {
    if (typeof id !== "string") {
      throw new Error("id not found");
    }
    try {
      let formatedIds: string[] = [];
      
      const rowIds=await this.matchRepo.fetchPartnerIds(id);

      if (rowIds?.length > 0) {
          formatedIds= rowIds?.map((el) => {
          return objectIdToString(el.match._id);
        });
      }
       const ids:string[]=formatedIds


      const response = await this.messageRepo.fetchNewMessages(id, ids);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async messageCount(userID: unknown, from: unknown) {
    try {
      if (
        !userID ||
        !from ||
        typeof userID !== "string" ||
        typeof from !== "string"
      ) {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
      const newMessagesForNav = await this.fetchMessageCount(from, userID);
      const newMessagesNotifiation = await this.findNewMessages(userID);
      return { newMessagesForNav, newMessagesNotifiation };
    } catch {
      throw new Error(ResponseMessage.SERVER_ERROR);
    }
  }
}
// return({ count: 0 });
