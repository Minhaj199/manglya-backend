var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAge } from "../../interface/utility/ageCalculator.js";
export class UserProfileService {
    constructor(planRepo, imageService, userRepository, authService) {
        this.imageSevice = imageService;
        this.userRepository = userRepository;
        this.authService = authService;
        this.planRepo = planRepo;
    }
    uploadPhoto(path, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield this.imageSevice.upload(path);
                if (url && typeof url === 'string') {
                    const urlInserted = yield this.userRepository.addPhoto(url, email);
                    if (urlInserted) {
                        return url;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('error on image url getting');
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    }
    uploadInterest(intersts, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userRepository.addInterest(intersts, email);
            }
            catch (error) {
                throw new Error(error.message || 'internal server error');
            }
        });
    }
    fetchUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof id === 'string') {
                    const data = yield this.userRepository.getUserProfile(id);
                    const useFullData = {
                        PersonalInfo: Object.assign(Object.assign({}, data.PersonalInfo), { age: getAge(data.PersonalInfo.dateOfBirth) }),
                        PartnerData: data.partnerData,
                        Email: data.email,
                        subscriptionStatus: data.subscriber,
                        currentPlan: data.CurrentPlan
                    };
                    return useFullData;
                }
                else {
                    throw new Error('id not found-61');
                }
            }
            catch (error) {
                throw new Error(error.message || 'id not fount');
            }
        });
    }
    updateEditedData(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (typeof id !== 'string') {
                throw new Error('id not found');
            }
            const updateData = {};
            if (data.PersonalInfo.firstName !== '')
                updateData['PersonalInfo.firstName'] = data.PersonalInfo.firstName;
            if (data.PersonalInfo.secondName !== '')
                updateData['PersonalInfo.secondName'] = data.PersonalInfo.secondName;
            if (data.PersonalInfo.state !== '')
                updateData['PersonalInfo.state'] = data.PersonalInfo.state;
            if (data.PersonalInfo.gender !== '')
                updateData['PersonalInfo.gender'] = data.PersonalInfo.gender;
            if (data.PersonalInfo.dateOfBirth !== '')
                updateData['PersonalInfo.dateOfBirth'] = new Date(data.PersonalInfo.dateOfBirth);
            if (data.PersonalInfo.interest !== null)
                updateData['PersonalInfo.interest'] = data.PersonalInfo.interest;
            if (data.partnerData.gender !== '')
                updateData['partnerData.gender'] = data.partnerData.gender;
            if (data.email !== '')
                updateData['email'] = data.email;
            try {
                if (Object.keys(updateData).length) {
                    const data = yield this.userRepository.update(updateData, id);
                    const token = this.authService.regenerateToken(JSON.stringify(data._id), 'user', (_a = data.partnerData) === null || _a === void 0 ? void 0 : _a.gender, (_b = data.PersonalInfo) === null || _b === void 0 ? void 0 : _b.gender);
                    if (data._id) {
                        const useFullData = {
                            PersonalInfo: Object.assign(Object.assign({}, data.PersonalInfo), { age: getAge(data.PersonalInfo.dateOfBirth) }),
                            PartnerData: data.partnerData,
                            Email: data.email,
                            subscriptionStatus: data.subscriber,
                            currentPlan: data.CurrentPlan
                        };
                        return { data: useFullData, token };
                    }
                    const profile = yield this.fetchUserProfile(id);
                    return { data: profile, token };
                }
                else {
                    const response = yield this.fetchUserProfile(id);
                    return { data: response, token: false };
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(error.message);
            }
        });
    }
    fetchUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof id === 'string') {
                    const email = yield this.userRepository.findEmailByID(id);
                    if (email.email) {
                        return email.email;
                    }
                    else {
                        throw new Error('Internal server error,email not found');
                    }
                }
                else {
                    throw new Error('Internal server error');
                }
            }
            catch (error) {
                throw new Error(error.message || 'Internal server error');
            }
        });
    }
    fetchName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    throw new Error('id not found');
                }
                return this.userRepository.fetchName(id);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchUserDatasForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepository.fetchUserDataForAdmin();
                if (data.length) {
                    const processedData = data.map((el, index) => (Object.assign(Object.assign({}, el), { expiry: (el === null || el === void 0 ? void 0 : el.CreatedAt) ? el.CreatedAt.toDateString() : el === null || el === void 0 ? void 0 : el.CreatedAt, no: index + 1 })));
                    return processedData;
                }
                else {
                    return [];
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchSubscriberDetailforAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const planDataDraft = yield this.planRepo.fetchPlanAdmin();
                const planData = planDataDraft === null || planDataDraft === void 0 ? void 0 : planDataDraft.map(el => {
                    return { name: el.name };
                });
                const userDataDraft = yield this.userRepository.fetchSubscriber();
                if (userDataDraft.length > 0) {
                    let userData = userDataDraft.map((el, index) => {
                        return { no: index + 1, username: el.username, MatchCountRemaining: el.MatchCountRemaining, expiry: new Date(el.expiry).toDateString(), planAmount: el.planAmount, planName: el.planName };
                    });
                    return { userData, planData };
                }
                else {
                    return { userData: [], planData: planData };
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    blockAndBlock(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userRepository.blockAndUnblockUser(userId, action);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findCurrentPlanAndRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findCurrentPlanAndRequests(userId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
