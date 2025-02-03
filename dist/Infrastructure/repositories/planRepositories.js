var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { planModel } from "../db/planModel.js";
import BaseRepository from "./baseRepository.js";
export class PlanRepository extends BaseRepository {
    constructor() {
        super(planModel);
    }
    getAllPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield planModel.find({
                    delete: false,
                });
                return response;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof data._id === "string") {
                    const response = yield planModel.updateOne({ _id: data._id }, { $set: data });
                    if (response) {
                        return true;
                    }
                }
                throw new Error("Error on id");
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
    softDlt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield planModel.updateOne({ _id: id }, { $set: { delete: true } });
                if (response.acknowledged) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message || "error on remove plan");
            }
        });
    }
    fetchPlanAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find({}, { _id: 0, name: 1 });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
