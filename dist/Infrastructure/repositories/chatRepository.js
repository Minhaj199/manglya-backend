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
import { chatModel } from "../db/chatModel.js";
import BaseRepository from "./baseRepository.js";
export class ChatRoomRepository extends BaseRepository {
    constructor() {
        super(chatModel);
    }
    findChatRoomWithIDs(user1, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findOne({
                    members: { $all: [new Types.ObjectId(user1), new Types.ObjectId(user2)] }
                });
                return result;
            }
            catch (error) {
                throw new Error(error.message || 'error on chat fetching');
            }
        });
    }
    findChatRoomWithID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ id }).populate('members', 'PersonalInfo.firstName PersonalInfo.image');
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchDatasForCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield chatModel.aggregate([{ $match: { members: { $in: [new Types.ObjectId(id)] } } }, { $lookup: { from: 'messages', localField: '_id', foreignField: 'chatRoomId', as: 'chats' } },
                    { $project: { _id: 0, chats: 1 } }, { $unwind: '$chats' }, { $match: { $and: [{ 'chats.viewedOnNav': false }, { 'chats.viewedList': false }, { 'chats.receiverId': new Types.ObjectId(id) }] } }, { $project: { 'chats._id': 1 } }]);
                return response;
            }
            catch (error) {
                throw new Error();
            }
        });
    }
}
