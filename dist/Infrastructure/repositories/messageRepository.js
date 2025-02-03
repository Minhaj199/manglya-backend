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
import { messageModel } from "../db/messageModel.js";
import BaseRepository from "./baseRepository.js";
export class MessageRepository extends BaseRepository {
    constructor() {
        super(messageModel);
    }
    findMessages(chatRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof chatRoomId !== 'string') {
                throw new Error('interanal server error on message fetching');
            }
            try {
                const data = yield this.model.find({ chatRoomId }).sort({ createdAt: 1 });
                return data;
            }
            catch (error) {
                throw new Error(error.message || 'internal server error');
            }
        });
    }
    findAllMessage(chatRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageModel.find({ chatRoomId: chatRoomId }, { _id: 0, text: 1, createdAt: 1, receiverId: 1, image: 1 }).sort({ createdAt: 1 });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateReadedMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.model.updateMany({ chatRoomId: new Types.ObjectId(id) }, { viewedOnNav: true, viewedList: true });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updatAllMessagesReaded(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(ids) || (ids === null || ids === void 0 ? void 0 : ids.length) < 0) {
                return true;
            }
            try {
                const data = yield this.model.updateMany({ _id: ids }, { viewedOnNav: true });
                return true;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findNewMessages(userId, partnerIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((partnerIds === null || partnerIds === void 0 ? void 0 : partnerIds.length) <= 0) {
                return [];
            }
            const parsedIds = partnerIds.map(el => new Types.ObjectId(el));
            try {
                const result = yield this.model.aggregate([{ $match: { viewedOnNav: false, viewedList: false, receiverId: new Types.ObjectId(userId), senderId: { $in: parsedIds } } }, { $lookup: { from: 'users', localField: 'senderId', foreignField: '_id', as: "info" } },
                    { $project: { _id: 0, name: '$info.PersonalInfo.firstName', userId: '$info._id', createdAt: 1 } }, { $group: { _id: '$name', userId: { $push: '$userId' }, count: { $sum: 1 } } }, { $project: { count: 1, _id: 0, userId: { $arrayElemAt: ["$userId", 0] }, name: { $arrayElemAt: ["$_id", 0] } } },
                    { $project: { count: 1, _id: 0, userId: { $toString: { $arrayElemAt: ["$userId", 0] } }, name: 1 } }
                ]);
                return result;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
