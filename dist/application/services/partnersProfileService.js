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
import { socketIdMap } from "../../server.js";
export class PartnerProfileService {
    constructor(userRepository, interestRepo) {
        this.userRepository = userRepository;
        this.interestRepo = interestRepo;
    }
    addMatch(userId, matchedId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof userId === 'string') {
                    const user = yield this.userRepository.getUserProfile(userId);
                    if (user) {
                        if (user.subscriber === 'subscribed') {
                            if (user.CurrentPlan) {
                                if (user.CurrentPlan.Expiry > new Date()) {
                                    return this.userRepository.addMatch(userId, matchedId, user);
                                }
                                else {
                                    throw new Error("You plan is Expired");
                                }
                            }
                            else {
                                throw new Error("No active Plan");
                            }
                        }
                        else if (user.subscriber === "connect over") {
                            throw new Error("You connection count over!! please buy a plan");
                        }
                        else {
                            throw new Error("You are not subscribed, please buy a plan");
                        }
                    }
                    else {
                        throw new Error('user not found');
                    }
                }
                else {
                    throw new Error('id not found');
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    manageReqRes(requesterId, userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(requesterId, userId);
                if (typeof userId === 'string') {
                    return this.userRepository.manageReqRes(requesterId, userId, action);
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message || 'internal server error on manage request');
            }
        });
    }
    fetchProfileData(userId, userGender, partnerGender) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const datas = yield this.userRepository.fetchPartnerProfils(userId, userGender, partnerGender);
                const currntPlan = yield this.userRepository.getCurrentPlan(userId);
                let interest = yield this.interestRepo.getInterest();
                let interestArray = [];
                if (interest === null || interest === void 0 ? void 0 : interest.length) {
                    interestArray = interest;
                }
                if (!interestArray[0].allInterests) {
                    throw new Error('Error on interest fetching');
                }
                if (datas[0].profile) {
                    datas[0].profile = datas[0].profile.map((el, index) => {
                        return (Object.assign(Object.assign({}, el), { no: index + 1, age: getAge(el.dateOfBirth) }));
                    });
                }
                return { datas, currntPlan: (_a = currntPlan[0]) === null || _a === void 0 ? void 0 : _a.CurrentPlan, interest: interestArray[0].allInterests };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchUserForLandingShow() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.userRepository.getUsers();
                if (data.length > 0) {
                    const response = [];
                    data.forEach((el) => {
                        response.push({
                            name: `${el.name} ${el.secondName}`,
                            age: getAge(el.age),
                            image: el.image || "",
                        });
                    });
                    return response;
                }
                else {
                    return [];
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on page showing');
            }
        });
    }
    matchedProfiles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof id === 'string') {
                    let formatedResponse = [];
                    let Places = [];
                    const response = yield this.userRepository.getMatchedRequest(id);
                    if (response.length) {
                        let online = [];
                        if (socketIdMap.size >= 1) {
                            for (let value of socketIdMap.keys()) {
                                online.push(value);
                            }
                        }
                        response === null || response === void 0 ? void 0 : response.forEach(element => {
                            formatedResponse.push(Object.assign(Object.assign({}, element), { age: getAge(element.dateOfBirth) }));
                            if (!Places.includes(element.state))
                                Places.push(element.state);
                        });
                        return { formatedResponse, Places, onlines: online };
                    }
                    else {
                        return response;
                    }
                }
                else {
                    throw new Error('id not found');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on request fetching');
            }
        });
    }
    deleteMatchedUser(userId, partnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== 'string' || !partnerId) {
                throw new Error('error on deleting user');
            }
            try {
                if (typeof userId === 'string' && typeof partnerId === 'string') {
                    const response = yield this.userRepository.deleteMatched(userId, partnerId);
                    return response;
                }
                else {
                    throw new Error('error on ids');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on deletion');
            }
        });
    }
    fetchSuggestions(id, partnerPreference, gender) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                if (typeof id === 'string') {
                    let fetchedProfiles = [];
                    let datas = yield this.userRepository.fetchSuggetions(id, gender, partnerPreference);
                    let currntPlan = yield this.userRepository.getCurrentPlan(id);
                    if (datas[0].profile) {
                        datas[0].profile = (_a = datas[0].profile) === null || _a === void 0 ? void 0 : _a.map((el, index) => {
                            return (Object.assign(Object.assign({}, el), { no: index + 1, age: getAge(el.dateOfBirth) }));
                        });
                    }
                    if (datas[0].profile && datas[0].userProfile) {
                        const main = datas[0].userProfile[0];
                        if (!((_c = (_b = main.PersonalInfo) === null || _b === void 0 ? void 0 : _b.interest) === null || _c === void 0 ? void 0 : _c.length)) {
                            return { datas: [{ profile: [] }] };
                        }
                        let FirstCat = { subscriber: [], connectionOver: [], prioriy: [] };
                        for (let user of datas[0].profile) {
                            if ((_d = main.PersonalInfo) === null || _d === void 0 ? void 0 : _d.interest.every(el => user === null || user === void 0 ? void 0 : user.interest.includes(el))) {
                                if (user.subscriber === 'subscribed' || user.subscriber === "connection over") {
                                    if ((_e = user === null || user === void 0 ? void 0 : user.planFeatures) === null || _e === void 0 ? void 0 : _e.includes('Priority')) {
                                        FirstCat.prioriy.push(Object.assign(Object.assign({}, user), { matchStatics: 'hr' }));
                                    }
                                    else {
                                        FirstCat.subscriber.push(Object.assign(Object.assign({}, user), { matchStatics: 'rc' }));
                                    }
                                }
                            }
                            else {
                                if (user.subscriber === 'subscribed' || user.subscriber === "connection over") {
                                    if ((user === null || user === void 0 ? void 0 : user.planFeatures) && ((_f = user === null || user === void 0 ? void 0 : user.planFeatures) === null || _f === void 0 ? void 0 : _f.includes('Priority')) &&
                                        ((_g = user.interest) === null || _g === void 0 ? void 0 : _g.some(elem => { var _a; return (_a = main.PersonalInfo.interest) === null || _a === void 0 ? void 0 : _a.includes(elem); }))) {
                                        FirstCat.prioriy.push(Object.assign(Object.assign({}, user), { matchStatics: 'phr' }));
                                    }
                                    else if ((user === null || user === void 0 ? void 0 : user.interest) && (user === null || user === void 0 ? void 0 : user.interest.some(elem => { var _a, _b; return (_b = (_a = main.PersonalInfo) === null || _a === void 0 ? void 0 : _a.interest) === null || _b === void 0 ? void 0 : _b.includes(elem); }))) {
                                        FirstCat.prioriy.push(Object.assign(Object.assign({}, user), { matchStatics: 'np' }));
                                    }
                                }
                            }
                        }
                        const array = [...FirstCat.prioriy, ...FirstCat.subscriber, ...FirstCat.connectionOver];
                        fetchedProfiles = [{ profile: array, request: datas[0].request }];
                    }
                    return ({ datas: fetchedProfiles, currntPlan: (_h = currntPlan[0]) === null || _h === void 0 ? void 0 : _h.CurrentPlan });
                }
                else {
                    throw new Error('id not found');
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message || 'Error on suggstion page fetching');
            }
        });
    }
    createRequeset(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('internal server error ');
            }
            try {
                return yield this.userRepository.createRequest(id);
            }
            catch (error) {
                throw new Error(error.messag || 'internal server error');
            }
        });
    }
}
