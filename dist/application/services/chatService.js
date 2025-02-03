var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Types } from "mongoose";
import { objectIdToString } from "../../interface/utility/objectIdToString.js";
export class ChatService {
    constructor(userRepo, chatRoomRepo, messageService, jwtService) {
        this.userRepo = userRepo;
        this.chatRoomRepo = chatRoomRepo;
        this.messageService = messageService;
        this.jwtService = jwtService;
    }
    fetchChats(user, secondUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof user === "string" && typeof secondUser === "string") {
                try {
                    const chat = yield this.chatRoomRepo.findChatRoomWithIDs(user, secondUser);
                    if (chat && chat._id) {
                        return { chatRoomId: objectIdToString(chat._id) };
                    }
                    const data = {
                        members: [new Types.ObjectId(user), new Types.ObjectId(secondUser)],
                    };
                    const response = yield this.chatRoomRepo.create(data);
                    if (response && response._id) {
                        return { chatRoomId: objectIdToString(response._id) };
                    }
                    else {
                        throw new Error("Internal server error on chat");
                    }
                }
                catch (error) {
                    console.log(error);
                    throw new Error(error.message);
                }
            }
            else {
                throw new Error("internal server error on fetch Chat");
            }
        });
    }
    createMessage(chatRoomId, senderId, receiverId, text, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docodeSenderId = this.jwtService.verifyRefreshToken(senderId, 'user');
                if (!docodeSenderId) {
                    throw new Error('sender id not found');
                }
                const data = {
                    chatRoomId: new Types.ObjectId(chatRoomId),
                    senderId: new Types.ObjectId(docodeSenderId),
                    receiverId: new Types.ObjectId(receiverId),
                    viewedOnNav: false,
                    viewedList: false,
                    text: text,
                    image: image,
                };
                return this.messageService.createMessage(data);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchUserForChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userData = yield this.userRepo.getUserProfile(id);
                return {
                    name: userData.PersonalInfo.firstName
                        ? userData.PersonalInfo.firstName
                        : "",
                    photo: ((_a = userData.PersonalInfo) === null || _a === void 0 ? void 0 : _a.image) ? (_b = userData.PersonalInfo) === null || _b === void 0 ? void 0 : _b.image : "",
                };
            }
            catch (error) {
                throw new Error(error.message || "internal server error on userfetch");
            }
        });
    }
}
