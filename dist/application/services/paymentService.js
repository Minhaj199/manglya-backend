var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { doStripePayment } from "../../interface/utility/stripe.js";
import { Types } from "mongoose";
import { GetExpiryPlan } from "../../interface/utility/getExpiryDateOfPlan.js";
export class PaymentSerivice {
    constructor(orderRepo, userRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
    }
    purchase(plan, token, email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userPlan = yield this.userRepo.getCurrentPlan(userId);
                if (userPlan.length > 0 && ((_a = userPlan[0]) === null || _a === void 0 ? void 0 : _a.CurrentPlan)) {
                    if (Number((_b = userPlan[0]) === null || _b === void 0 ? void 0 : _b.CurrentPlan.avialbleConnect) > 0 && userPlan[0].CurrentPlan.name === plan.name) {
                        throw new Error('already have same plan and sufficiet connect.chouse different plan if you want');
                    }
                }
                const result = yield doStripePayment(plan, token, email);
                if (result === 'succeeded') {
                    const data = {
                        userID: new Types.ObjectId(userId),
                        amount: plan.amount,
                        connect: Number(plan.connect),
                        avialbleConnect: Number(plan.connect),
                        duration: plan.duration,
                        features: plan.features,
                        name: plan.name,
                        Expiry: GetExpiryPlan(plan.duration),
                    };
                    const response = yield this.orderRepo.create(data);
                    const id = String(response === null || response === void 0 ? void 0 : response._id);
                    if (typeof id === 'string') {
                        const response2 = yield this.userRepo.addPurchaseData(id, userId, data);
                        if (response2) {
                            return response2;
                        }
                        else {
                            throw new Error('internal server error on order creation 2');
                        }
                    }
                    else {
                        throw new Error('internal server error on order creation');
                    }
                }
                else {
                    return false;
                }
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("Name already exist");
                }
                else {
                    throw new Error(error);
                }
            }
        });
    }
}
