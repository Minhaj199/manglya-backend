import { Types } from "mongoose";
import { UserRepository } from "../../domain/interface/userRepositoryInterface.js";
import { ChatRoomRepository } from "../../Infrastructure/repositories/chatRepository.js";
import { MessageService } from "./messageServie.js";
import { ChatRoom, IMessageWithoutId } from "../../types/TypesAndInterfaces.js";
import { objectIdToString } from "../../interface/utility/objectIdToString.js";
import { ChatServiceInterface } from "../../types/serviceLayerInterfaces.js";
import { JWTAdapter } from "../../Infrastructure/jwt.js";

export class ChatService implements ChatServiceInterface {
  private userRepo: UserRepository;
  private chatRoomRepo: ChatRoomRepository;
  private messageService: MessageService;
  private jwtService:JWTAdapter
  constructor(
    userRepo: UserRepository,
    chatRoomRepo: ChatRoomRepository,
    messageService: MessageService,
    jwtService:JWTAdapter
  ) {
    this.userRepo = userRepo;
    this.chatRoomRepo = chatRoomRepo;
    this.messageService = messageService;
    this.jwtService=jwtService
  }
  async fetchChats(user: unknown, secondUser: unknown) {
    if (typeof user === "string" && typeof secondUser === "string") {
      try {
        const chat: ChatRoom | null =
          await this.chatRoomRepo.findChatRoomWithIDs(user, secondUser);

        if (chat && chat._id) {
          return { chatRoomId: objectIdToString(chat._id) };
        }
        const data = {
          members: [new Types.ObjectId(user), new Types.ObjectId(secondUser)],
        };
        const response = await this.chatRoomRepo.create(data);

        if (response && response._id) {
          return { chatRoomId: objectIdToString(response._id) };
        } else {
          throw new Error("Internal server error on chat");
        }
      } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
      }
    } else {
      throw new Error("internal server error on fetch Chat");
    }
  }
  async createMessage(
    chatRoomId: string,
    senderId: string,
    receiverId:string,
    text: string,
    image: boolean
  ) {
    try {
      const docodeSenderId=this.jwtService.verifyRefreshToken(senderId,'user')
      if(!docodeSenderId){
        throw new Error('sender id not found')
      }
      const data: IMessageWithoutId = {
        chatRoomId: new Types.ObjectId(chatRoomId),
        senderId: new Types.ObjectId(docodeSenderId),
        receiverId:new Types.ObjectId(receiverId),
        viewedOnNav: false,
        viewedList: false,
        text: text,
        image: image,
      };
      return this.messageService.createMessage(data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async fetchUserForChat(id: string) {
    try {
      const userData = await this.userRepo.getUserProfile(id);
      return {
        name: userData.PersonalInfo.firstName
          ? userData.PersonalInfo.firstName
          : "",
        photo: userData.PersonalInfo?.image ? userData.PersonalInfo?.image : "",
      };
    } catch (error: any) {
      throw new Error(error.message || "internal server error on userfetch");
    }
  }
}
