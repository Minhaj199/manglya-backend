import { Types } from "mongoose";
import { IUserProfileRepository} from "../../repository/interface/IUserRepository";
import { IChatRepository } from "../../repository/interface/IChatRoomRepository";
import { objectIdToString } from "../../utils/objectIdToString";
import { IChatService } from "../interfaces/IChatService";
import { IMessageService } from "../interfaces/IMessageSerivice";
import { IJwtService } from "../../types/UserRelatedTypes";
import {
  IChatRoom,
  IChatRoomInput,
  IMessageWithoutId,
} from "../../types/TypesAndInterfaces";
import { MessageDTO } from "../../dtos/chattingrRelatedDTO";
import { AppError } from "../../types/customErrorClass";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class ChatService implements IChatService {
  
  constructor(
  private userProfileRepo:IUserProfileRepository,
  private chatRoomRepo: IChatRepository,
  private messageService: IMessageService,
  private jwtService: IJwtService
  ) {
    
  }
  async fetchChats(client1: unknown, client2: unknown) {
    if (typeof client1 === "string" && typeof client2 === "string") {
      try {
        const chat: IChatRoom | null =
          await this.chatRoomRepo.fetchChatRoomWithIDs(client1, client2);

        if (chat && chat._id) {
          return { chatRoomId: objectIdToString(chat._id) };
        }
        const data: IChatRoomInput = {
          members: [new Types.ObjectId(client1), new Types.ObjectId(client2)],
        };
        const response = await this.chatRoomRepo.create(data);

        if (response && response._id) {
          return { chatRoomId: objectIdToString(response._id) };
        } else {
          throw new Error("Internal server error on chat");
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("unexptected error");
        }
      }
    } else {
      throw new Error("internal server error on fetch Chat");
    }
  }
  async createMessage(
    chatRoomId: string,
    senderId: string,
    receiverId: string,
    text: string,
    image: boolean
  ) {
    try {
      const decodeSenderId = this.jwtService.verifyRefreshToken(
        senderId,
        "user"
      );

      if (!decodeSenderId || typeof decodeSenderId !== "string") {
        throw new Error("sender id not found");
      }
      const rowdata: IMessageWithoutId = {
        chatRoomId: new Types.ObjectId(chatRoomId),
        senderId: new Types.ObjectId(decodeSenderId),
        receiverId: new Types.ObjectId(receiverId),
        viewedOnNav: false,
        viewedList: false,
        text: text,
        image: image,
      };
      const createdMessage = await this.messageService.createMessage(rowdata);
      const { message } = new MessageDTO(createdMessage);
      return message ;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchUserForChat(id: string) {
    try {
   
      if (!id) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
   
      const userData = await this.userProfileRepo.fetchUserProfile(id);
      return {
        name: userData.PersonalInfo.firstName
          ? userData.PersonalInfo.firstName
          : "",
        photo: userData.PersonalInfo?.image ? userData.PersonalInfo?.image : "",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}
