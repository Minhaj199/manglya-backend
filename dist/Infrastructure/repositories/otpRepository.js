var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OtpModel } from "../db/otpModel.js";
import BaseRepository from "./baseRepository.js";
export class OtpRepository extends BaseRepository {
    constructor() {
        super(OtpModel);
    }
    getOTP(email, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpDoc = yield OtpModel.aggregate([
                    { $match: { $and: [{ email: email }, { from: from }] } },
                    { $sort: { _id: -1 } },
                    { $limit: 1 },
                ]);
                if (otpDoc.length > 0) {
                    return otpDoc[0];
                }
                else {
                    return [];
                }
            }
            catch (error) {
                throw new Error("otp failure");
            }
        });
    }
}
