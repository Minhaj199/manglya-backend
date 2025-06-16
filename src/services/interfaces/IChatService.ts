import {IMessageOuput } from "../../types/TypesAndInterfaces";

export interface IChatService {
  fetchChats(
    user: unknown,
    secondUser: unknown
  ): Promise<{ chatRoomId: string }>;
  createMessage(
    chatRoomId: string,
    senderId: string,
    receiverId: string,
    text: string,
    image: boolean
  ): Promise<IMessageOuput>;
  fetchUserForChat(id: string): Promise<{ name: string; photo: string }>;
}