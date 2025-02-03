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
import { planOrderModel } from "../db/planOrder.js";
import BaseRepository from "./baseRepository.js";
export class PurchasedPlan extends BaseRepository {
    constructor() {
        super(planOrderModel);
    }
    fetchRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const revenue = yield planOrderModel.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: "$amount" }
                        }
                    }
                ]);
                if ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) {
                    return (_b = revenue[0]) === null || _b === void 0 ? void 0 : _b.totalAmount;
                }
                else {
                    return 0;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.aggregate([{ $match: { userID: new Types.ObjectId(id) } }, { $sort: { _id: -1 } }, { $skip: 1 }]);
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
