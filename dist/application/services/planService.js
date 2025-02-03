var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PlanService {
    constructor(planRepo, purchaseRepo) {
        this.planRepo = planRepo;
        this.purchaseRepo = purchaseRepo;
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.planRepo.getAllPlans();
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    createPlan(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.planRepo.create(plan);
                return response;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    editPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.planRepo.editPlan(data);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof id !== 'string') {
                    throw new Error('erron on id getting');
                }
                return yield this.planRepo.softDlt(id);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseRepo.fetchHistory(id);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
