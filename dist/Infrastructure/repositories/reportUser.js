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
import { reportUser } from "../db/reportedUser.js";
import BaseRepository from "./baseRepository.js";
export class ReportUser extends BaseRepository {
    constructor() {
        super(reportUser);
    }
    findComplain(id, reason, partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ reporter: new Types.ObjectId(id), reported: new Types.ObjectId(partnerId), reason: reason });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find().sort({ _id: -1 }).populate('reporter', 'PersonalInfo.firstName').populate('reported', 'PersonalInfo.firstName');
                return response;
            }
            catch (error) {
                throw new Error(error.message || 'error on data fetching');
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield reportUser.deleteOne({ _id: new Types.ObjectId(id) });
                if (response.acknowledged) {
                    return true;
                }
                else {
                    throw new Error('error on deletion');
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, field, change) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield reportUser.updateOne({ _id: new Types.ObjectId(id) }, { $set: { [field]: change } });
                if (response) {
                    return true;
                }
                else {
                    throw new Error('error on setWaring');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on message');
            }
        });
    }
}
