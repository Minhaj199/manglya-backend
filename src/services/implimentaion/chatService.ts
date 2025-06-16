import { Types } from "mongoose";
import { IUserRepository } from "../../repository/interface/IUserRepository.ts";
import { IChatRepository } from "../../repository/interface/IChatRoomRepository.ts";
import { objectIdToString } from "../../utils/objectIdToString.ts";
import { IChatService } from "../interfaces/IChatService.ts";
import { IMessageService } from "../interfaces/IMessageSerivice.ts";
import { IJwtService } from "../../types/UserRelatedTypes.ts";
import {
  IChatRoom,
  IChatRoomInput,
  IMessageWithoutId,
} from "../../types/TypesAndInterfaces.ts";
import { MessageDTO } from "../../dtos/chattingrRelatedDTO.ts";
import { AppError } from "../../types/customErrorClass.ts";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain.ts";

export class ChatService implements IChatService {
  private userRepo: IUserRepository;
  private chatRoomRepo: IChatRepository;
  private messageService: IMessageService;
  private jwtService: IJwtService;
  constructor(
    userRepo: IUserRepository,
    chatRoomRepo: IChatRepository,
    messageService: IMessageService,
    jwtService: IJwtService
  ) {
    this.userRepo = userRepo;
    this.chatRoomRepo = chatRoomRepo;
    this.messageService = messageService;
    this.jwtService = jwtService;
  }
  async fetchChats(client1: unknown, client2: unknown) {
    if (typeof client1 === "string" && typeof client2 === "string") {
      try {
        const chat: IChatRoom | null =
          await this.chatRoomRepo.findChatRoomWithIDs(client1, client2);

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
      return { ...message };
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
      const userData = await this.userRepo.getUserProfile(id);
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
