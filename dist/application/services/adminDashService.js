var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DashService {
    constructor(userRepo, purchaseRepo) {
        this.userRepo = userRepo;
        this.purchaseRepo = purchaseRepo;
    }
    totalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.purchaseRepo.fetchRevenue();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    dashCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepo.getDashCount();
                let ans = { subscriber: 0, notSubscriber: 0 };
                if (data === null || data === void 0 ? void 0 : data.subscriberGroups.length) {
                    data.subscriberGroups.forEach((el) => {
                        if (el._id === "subscribed" || el._id === "connection finished") {
                            ans.subscriber += el.count;
                        }
                        else {
                            ans.notSubscriber += el.count;
                        }
                    });
                }
                const planRevenue = yield this.totalRevenue();
                return {
                    MonthlyRevenue: planRevenue,
                    SubscriberCount: ans.subscriber,
                    UserCount: data.totalCount,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    SubscriberCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepo.getSubcriberCount();
                let ans = { subscriber: 0, notSubscriber: 0 };
                if (data === null || data === void 0 ? void 0 : data.length) {
                    data.forEach((el) => {
                        if (el._id === "subscribed" || el._id === "connection finished") {
                            ans.subscriber += el.count;
                        }
                        else {
                            ans.notSubscriber += el.count;
                        }
                    });
                }
                const response = [];
                response[0] = parseFloat(((ans.subscriber / (ans.notSubscriber + ans.subscriber)) * 100).toFixed(2));
                response[1] = parseFloat(((ans.notSubscriber / (ans.notSubscriber + ans.subscriber)) *
                    100).toFixed(2));
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    revenueForGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepo.getRevenue();
                const month = [];
                const total = [];
                if (result.length) {
                    result.forEach((el) => {
                        month.push(el === null || el === void 0 ? void 0 : el._id.slice(5));
                        total.push(el === null || el === void 0 ? void 0 : el.total);
                    }, []);
                }
                return { month: month, revenue: total };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
