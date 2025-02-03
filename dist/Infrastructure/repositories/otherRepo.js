var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { featureModel } from "../db/featureModel.js";
import { InterestModel } from "../db/signupInterest.js";
import BaseRepository from "./baseRepository.js";
import { refeshTokenModel } from "../db/refreshToken.js";
import { Types } from "mongoose";
export class InterestRepo extends BaseRepository {
    constructor() {
        super(InterestModel);
    }
    getInterest() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate([
                {
                    $project: {
                        arrayFields: {
                            $filter: {
                                input: { $objectToArray: "$$ROOT" },
                                as: "field",
                                cond: { $isArray: "$$field.v" },
                            },
                        },
                    },
                },
                {
                    $project: {
                        allInterests: {
                            $reduce: {
                                input: "$arrayFields",
                                initialValue: [],
                                in: { $concatArrays: ["$$value", "$$this.v"] },
                            },
                        },
                    },
                },
            ]);
        });
    }
    getInterestAsCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({}, { _id: 0, sports: 1, music: 1, food: 1 });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    isExist() {
        return __awaiter(this, void 0, void 0, function* () {
            const exitstingData = yield InterestModel.findOne();
            return exitstingData;
        });
    }
}
export class FeaturesRepository extends BaseRepository {
    constructor() {
        super(featureModel);
    }
    isExits() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.model.findOne();
                if (isExist) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchFeature() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield featureModel.findOne({}, { _id: 0, features: 1 });
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
export class TokenRepository extends BaseRepository {
    constructor() {
        super(refeshTokenModel);
    }
    fetchToken(extractId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ token: refreshToken, userId: extractId }).populate('userId');
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.deleteOne({ userId: new Types.ObjectId(id), token: token });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
