var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from "../db/userModel.js";
import { Types } from "mongoose";
import { planOrderModel } from "../db/planOrder.js";
import { getDateFromAge } from "../../interface/utility/getDateFromAge.js";
import BaseRepository from "./baseRepository.js";
import { objectIdToString } from "../../interface/utility/objectIdToString.js";
export class UserRepsitories extends BaseRepository {
    constructor() {
        super(UserModel);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findOne({ email, block: false }).lean();
                return user;
            }
            catch (error) {
                throw new Error(error.message || 'errro occured on email fetching');
            }
        });
    }
    addPhoto(photo, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel.updateOne({ email }, { $set: { "PersonalInfo.image": photo } });
                if (result) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on message');
            }
        });
    }
    addInterest(interst, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel.updateOne({ email }, { $set: { "PersonalInfo.interest": interst } });
                if (result) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on interest adding');
            }
        });
    }
    addMatch(userId, matchedId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId === 'string') {
                if (userId && matchedId) {
                    const userMatchId = new Types.ObjectId(matchedId);
                    const userID = new Types.ObjectId(userId);
                    try {
                        if ((user === null || user === void 0 ? void 0 : user.CurrentPlan) && user.CurrentPlan.avialbleConnect === 1) {
                            const result = yield UserModel.bulkWrite([
                                {
                                    updateOne: {
                                        filter: { _id: userId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                                        update: {
                                            $addToSet: {
                                                match: { _id: userMatchId, typeOfRequest: "send" },
                                            },
                                        },
                                    },
                                },
                                {
                                    updateOne: {
                                        filter: { _id: userId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                                        update: { $set: { subscriber: "connection finished" } },
                                    },
                                },
                                {
                                    updateOne: {
                                        filter: { _id: userId },
                                        update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                                    },
                                },
                                {
                                    updateOne: {
                                        filter: { _id: matchedId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                                        update: {
                                            $addToSet: {
                                                match: { _id: userID, typeOfRequest: "recieved" },
                                            },
                                        },
                                    },
                                },
                            ]);
                            if (result) {
                                return true;
                            }
                        }
                        else if ((user === null || user === void 0 ? void 0 : user.CurrentPlan) && user.CurrentPlan.avialbleConnect > 1) {
                            const result = yield UserModel.bulkWrite([
                                {
                                    updateOne: {
                                        filter: { _id: userId, match: { $not: { $elemMatch: { _id: userMatchId } } } },
                                        update: {
                                            $addToSet: {
                                                match: { _id: userMatchId, typeOfRequest: "send" },
                                            },
                                        },
                                    },
                                },
                                {
                                    updateOne: {
                                        filter: { _id: userId },
                                        update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                                    },
                                },
                                {
                                    updateOne: {
                                        filter: { _id: matchedId, match: { $not: { $elemMatch: { _id: userId } } } },
                                        update: {
                                            $addToSet: {
                                                match: { _id: userID, typeOfRequest: "recieved" },
                                            },
                                        },
                                    },
                                },
                            ]);
                            if (result) {
                                return true;
                            }
                            else {
                                throw new Error('Error on Request sending');
                            }
                        }
                        else {
                            throw new Error('Connection count over');
                        }
                    }
                    catch (error) {
                        console.log(error);
                        return false;
                    }
                }
            }
            else {
                return false;
            }
            return false;
        });
    }
    manageReqRes(requesterId, userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (action === "accept" && typeof userId === 'string') {
                    try {
                        const convertedReqID = new Types.ObjectId(requesterId);
                        const convertedUserID = new Types.ObjectId(userId);
                        const response = yield UserModel.bulkWrite([
                            {
                                updateOne: {
                                    filter: { _id: convertedUserID, "match._id": convertedReqID },
                                    update: { $set: { "match.$.status": "accepted" } }
                                }
                            },
                            {
                                updateOne: {
                                    filter: { _id: convertedReqID, "match._id": convertedUserID },
                                    update: { $set: { "match.$.status": "accepted" } }
                                }
                            }
                        ]);
                        if (response) {
                            return true;
                        }
                        else {
                            return true;
                        }
                    }
                    catch (error) {
                        console.log(error);
                        throw new Error("error on manage Request");
                    }
                }
                else if (action === "reject" && typeof userId === 'string') {
                    try {
                        const convertedReqID = new Types.ObjectId(requesterId);
                        const convertedUserID = new Types.ObjectId(userId);
                        const response = yield UserModel.bulkWrite([
                            {
                                updateOne: {
                                    filter: { _id: convertedUserID, "match._id": convertedReqID, 'match.status': 'pending' },
                                    update: { $set: { "match.$.status": "rejected" } }
                                }
                            },
                            {
                                updateOne: {
                                    filter: { _id: convertedReqID, "match._id": convertedUserID, 'match.status': 'pending' },
                                    update: { $set: { "match.$.status": "rejected" } }
                                }
                            }
                        ]);
                        if (response) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    catch (error) {
                        throw new Error("error on manage Request");
                    }
                }
                else {
                    throw new Error("error on manage request");
                }
            }
            catch (error) {
                throw new Error("error on manage request");
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (yield UserModel.aggregate([
                    {
                        $facet: {
                            boys: [
                                { $match: { 'PersonalInfo.image': { $exists: true } } },
                                { $match: { "PersonalInfo.gender": "male" } },
                                { $sort: { _id: -1 } },
                                { $limit: 2 },
                            ],
                            girls: [
                                { $match: { 'PersonalInfo.image': { $exists: true } } },
                                { $match: { "PersonalInfo.gender": "female" } },
                                { $sort: { _id: -1 } },
                                { $limit: 2 },
                            ],
                        },
                    },
                    { $project: { combined: { $concatArrays: ["$boys", "$girls"] } } },
                    { $unwind: "$combined" },
                    { $replaceRoot: { newRoot: "$combined" } },
                    {
                        $project: {
                            _id: 0,
                            name: "$PersonalInfo.firstName",
                            secondName: "$PersonalInfo.secondName",
                            place: "$PersonalInfo.state",
                            age: "$PersonalInfo.dateOfBirth",
                            image: "$PersonalInfo.image",
                        },
                    },
                ]));
                if (data.length) {
                    return data;
                }
                else {
                    return [];
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message || "error on getting new added data");
            }
        });
    }
    getSearch(data, gender, preferedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datas = JSON.parse(data);
                if (datas.minAge > datas.maxAge) {
                    throw new Error('please enter a valid range');
                }
                const dates = getDateFromAge(datas.minAge, datas.maxAge);
                if (datas.district && datas.interest.length !== 0) {
                    const responseDB = yield UserModel.aggregate([{ $match: { $and: [{ 'PersonalInfo.gender': preferedGender }, { 'partnerData.gender': gender }, { 'PersonalInfo.dateOfBirth': { $lte: dates.minAgeDate, $gte: dates.maxAgeDate } }, { 'PersonalInfo.state': datas.district }, { 'PersonalInfo.interest': { $all: datas.interest } }] } },
                        { $project: { name: '$PersonalInfo.firstName',
                                lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                photo: '$PersonalInfo.image', match: '$match' } }, { $sort: { _id: -1 } }
                    ]);
                    return responseDB;
                }
                else if (!datas.district && datas.interest.length === 0) {
                    const responseDB = yield UserModel.aggregate([{ $match: { $and: [{ 'PersonalInfo.gender': preferedGender }, { 'partnerData.gender': gender }, { 'PersonalInfo.dateOfBirth': { $lte: dates.minAgeDate, $gte: dates.maxAgeDate } }] } },
                        { $project: { name: '$PersonalInfo.firstName',
                                lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                photo: '$PersonalInfo.image', match: '$match' } }, { $sort: { _id: -1 } }
                    ]);
                    return responseDB;
                }
                else if (datas.district) {
                    const responseDB = yield UserModel.aggregate([{ $match: { $and: [{ 'PersonalInfo.dateOfBirth': { $lte: dates.minAgeDate, $gte: dates.maxAgeDate } },
                                    { 'PersonalInfo.state': datas.district }
                                ] } },
                        { $project: { name: '$PersonalInfo.firstName',
                                lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                photo: '$PersonalInfo.image', match: '$match' } }, { $sort: { _id: -1 } }
                    ]);
                    return responseDB;
                }
                else if (datas.interest.length !== 0) {
                    const responseDB = yield UserModel.aggregate([{ $match: { $and: [{ 'PersonalInfo.gender': preferedGender }, { 'partnerData.gender': gender }, { 'PersonalInfo.dateOfBirth': { $lte: dates.minAgeDate, $gte: dates.maxAgeDate } }, { 'PersonalInfo.interest': { $all: datas.interest } }] } },
                        { $project: { name: '$PersonalInfo.firstName',
                                lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                photo: '$PersonalInfo.image', match: '$match' } }, { $sort: { _id: -1 } }
                    ]);
                    return responseDB;
                }
                throw new Error('Error on search ');
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    }
    findEmailByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || typeof id !== 'string') {
                    throw new Error('id not found');
                }
                const changedId = id;
                const email = yield UserModel.findById(changedId, { _id: 0, email: 1 });
                if (email === null || email === void 0 ? void 0 : email.email) {
                    return email;
                }
                throw new Error('email not found');
            }
            catch (error) {
                throw new Error(error.message || 'error on email fetching');
            }
        });
    }
    getUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel.findOne({ _id: id }).lean();
                if (user) {
                    return user;
                }
                else {
                    throw new Error('user not found');
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message || 'error on profile fetching');
            }
        });
    }
    update(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield UserModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: user }, { new: true });
                if (response) {
                    return response;
                }
                else {
                    throw new Error('not updated');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on update');
            }
        });
    }
    getRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield planOrderModel.aggregate([{ $group: { _id: { '$dateToString': { format: "%Y-%m-%d", date: "$created" } }, total: { $sum: '$amount' } } },
                { $sort: { _id: -1 } },
                { $limit: 7 }
            ]);
            return result;
        });
    }
    getSubcriberCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield UserModel.aggregate([{ $group: { _id: '$subscriber', count: { $sum: 1 } } }]);
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getDashCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield UserModel.aggregate([
                {
                    $facet: {
                        totalCount: [{ $count: "totalCount" }],
                        subscriberGroups: [
                            {
                                $group: {
                                    _id: "$subscriber",
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    }
                }
            ]);
            return { subscriberGroups: data[0].subscriberGroups, totalCount: data[0].totalCount[0].totalCount };
        });
    }
    getMatchedRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cropedId = id;
            try {
                const profiles = yield UserModel.aggregate([{ $match: { _id: new Types.ObjectId(cropedId) } }, { $project: { match: 1, _id: 0 } }, { $unwind: '$match' },
                    { $lookup: { from: 'users', localField: 'match._id', foreignField: '_id', as: 'datas' } }, { $unwind: '$datas' }, { $match: { 'match.status': 'accepted' } },
                    { $project: { _id: '$datas._id', photo: '$datas.PersonalInfo.image', firstName: '$datas.PersonalInfo.firstName', secondName: '$datas.PersonalInfo.secondName', state: '$datas.PersonalInfo.state', dateOfBirth: '$datas.PersonalInfo.dateOfBirth' } }
                ]);
                return profiles;
            }
            catch (error) {
                throw new Error(error.message || 'error on Fetching profile-MngRepos');
            }
        });
    }
    deleteMatched(id, matched) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield UserModel.updateOne({ _id: new Types.ObjectId(id) }, { $pull: { match: { _id: matched } } });
                const response2 = yield UserModel.updateOne({ _id: new Types.ObjectId(matched) }, { $pull: { match: { _id: id } } });
                if (response && response.acknowledged && response.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error('not deleted');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on deletion');
            }
        });
    }
    changePassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield UserModel.updateOne({ email: email }, { password: hashedPassword });
                if (response) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on password reset');
            }
        });
    }
    fetchPartnerProfils(userId, userGender, partnerGender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.model.aggregate([{
                        $facet: {
                            profile: [{ $match: { $and: [{ 'PersonalInfo.gender': partnerGender }, { 'partnerData.gender': userGender }, { match: { $not: { $elemMatch: { _id: new Types.ObjectId(userId) } } } }, { _id: { $ne: new Types.ObjectId(userId) } }] } }, { $project: { name: '$PersonalInfo.firstName',
                                        lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                        state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                        dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                        photo: '$PersonalInfo.image', match: '$match' } }, { $sort: { _id: -1 } }],
                            request: [{ $match: { _id: new Types.ObjectId(userId) } }, { $unwind: '$match' }, { $match: { 'match.status': 'pending', 'match.typeOfRequest': 'recieved' } },
                                { $lookup: { from: 'users', localField: 'match._id', foreignField: '_id', as: 'matchedUser' } }, { $unwind: '$matchedUser' }, { $project: { _id: 0, matchedUser: 1 } },
                                { $project: { _id: '$matchedUser._id', name: '$matchedUser.PersonalInfo.firstName',
                                        lookingFor: '$matchedUser.partnerData.gender', secondName: '$matchedUser.PersonalInfo.secondName',
                                        state: '$matchedUser.PersonalInfo.state', gender: '$matchedUser.PersonalInfo.gender',
                                        dateOfBirth: '$matchedUser.PersonalInfo.dateOfBirth', interest: '$matchedUser.PersonalInfo.interest',
                                        photo: '$matchedUser.PersonalInfo.image' } }, { $sort: { _id: -1 } }]
                        }
                    }]);
            }
            catch (error) {
                throw new Error(error.message || 'error on fetching');
            }
        });
    }
    getCurrentPlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.aggregate([{ $match: { _id: new Types.ObjectId(userId) } }, { $project: { _id: 0, CurrentPlan: 1 } }]);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    addPurchaseData(planId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.updateOne({ _id: new Types.ObjectId(id) }, { $push: { PlanData: planId }, $set: { subscriber: "subscribed", CurrentPlan: data } });
                if (result) {
                    return true;
                }
                else {
                    throw new Error('internal server error');
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message || 'internal server error');
            }
        });
    }
    fetchSuggetions(id, gender, partnerPreference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datas = yield UserModel.aggregate([{
                        $facet: {
                            profile: [{ $match: { $and: [{ 'PersonalInfo.gender': partnerPreference }, { 'partnerData.gender': gender }, { _id: { $ne: new Types.ObjectId(id) } }, { match: { $not: { $elemMatch: { _id: new Types.ObjectId(id) } } } }] } }, { $project: { name: '$PersonalInfo.firstName',
                                        lookingFor: '$partnerData.gender', secondName: '$PersonalInfo.secondName',
                                        state: '$PersonalInfo.state', gender: '$PersonalInfo.gender',
                                        dateOfBirth: '$PersonalInfo.dateOfBirth', interest: '$PersonalInfo.interest',
                                        photo: '$PersonalInfo.image', match: '$match', subscriber: '$subscriber', planFeatures: '$CurrentPlan.features' } }, { $sort: { _id: -1 } }],
                            request: [{ $match: { _id: new Types.ObjectId(id) } }, { $unwind: '$match' }, { $match: { 'match.status': 'pending', 'match.typeOfRequest': 'recieved' } },
                                { $lookup: { from: 'users', localField: 'match._id', foreignField: '_id', as: 'matchedUser' } }, { $unwind: '$matchedUser' }, { $project: { _id: 0, matchedUser: 1 } },
                                { $project: { _id: '$matchedUser._id', name: '$matchedUser.PersonalInfo.firstName',
                                        lookingFor: '$matchedUser.partnerData.gender', secondName: '$matchedUser.PersonalInfo.secondName',
                                        state: '$matchedUser.PersonalInfo.state', gender: '$matchedUser.PersonalInfo.gender',
                                        dateOfBirth: '$matchedUser.PersonalInfo.dateOfBirth', interest: '$matchedUser.PersonalInfo.interest',
                                        photo: '$matchedUser.PersonalInfo.image' } }, { $sort: { _id: -1 } }],
                            userProfile: [{ $match: { _id: new Types.ObjectId(id) } }]
                        }
                    }]);
                return datas;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel.findOne({ email: email });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel.aggregate([{ $match: { _id: new Types.ObjectId(id) } },
                    { $project: { _id: '$_id', photo: '$PersonalInfo.image', name: '$PersonalInfo.firstName' } }]);
                if (user) {
                    return Object.assign({}, user[0]);
                }
                else {
                    throw new Error('user not found');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on request injection');
            }
        });
    }
    makePlanExpire() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                const response = yield this.model.updateMany({ subscriber: 'subscribed', 'CurrentPlan.Expiry': { $lte: currentDate } }, { $set: { subscriber: 'expired', 'CurrentPlan': [] } });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = yield UserModel.findById(id, { _id: 0, 'PersonalInfo.firstName': 1 });
                if (name === null || name === void 0 ? void 0 : name.PersonalInfo.firstName) {
                    return name === null || name === void 0 ? void 0 : name.PersonalInfo.firstName;
                }
                else {
                    return 'name';
                }
            }
            catch (error) {
                return 'name';
            }
        });
    }
    fetchUserDataForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.aggregate([{ $sort: { _id: -1 } }, { $project: { username: '$PersonalInfo.firstName', email: 1, match: 1, subscriber: 1, CreatedAt: 1, block: 1 } }]);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchSubscriber() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.aggregate([{ $match: { $or: [{ subscriber: 'subscribed' }, { subscriber: 'connection finished' }] } }, { $match: { 'CurrentPlan.name': { $exists: true } } },
                    { $project: { _id: 0, username: '$PersonalInfo.firstName',
                            planName: '$CurrentPlan.name', MatchCountRemaining: '$CurrentPlan.avialbleConnect', expiry: '$CurrentPlan.Expiry', planAmount: '$CurrentPlan.amount' } }
                ]);
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    blockAndUnblockUser(id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.updateOne({ _id: new Types.ObjectId(id) }, { $set: { block: action } });
                if (response.acknowledged) {
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
    findPartnerIds(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.aggregate([{ $match: { _id: new Types.ObjectId(id) } }, { $project: { _id: 0, match: 1 } }, { $unwind: '$match' }, { $match: { 'match.status': 'accepted' } }, { $project: { 'match._id': 1 } }]);
                let finalResult = [];
                if ((result === null || result === void 0 ? void 0 : result.length) > 0) {
                    finalResult = result === null || result === void 0 ? void 0 : result.map(el => {
                        return objectIdToString(el.match._id);
                    });
                }
                return finalResult;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findCurrentPlanAndRequests(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.model.aggregate([{ $facet: { request: [{ $match: { _id: new Types.ObjectId(id) } }, { $project: { match: 1, _id: 0 } }, { $unwind: '$match' }, { $match: { 'match.typeOfRequest': 'send' } }, { $replaceRoot: { newRoot: '$match' } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'info' } }, { $project: { status: '$status', typeOfRequest: '$typeOfRequest', name: { $arrayElemAt: ["$info.PersonalInfo.firstName", 0] } } }], currertPlan: [{ $match: { _id: new Types.ObjectId(id) } }, { $project: { CurrentPlan: 1, _id: 0 } }] } },]);
                return { request: response[0].request || [], plan: ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.currertPlan[0].CurrentPlan) ? (_b = response[0]) === null || _b === void 0 ? void 0 : _b.currertPlan[0].CurrentPlan : [] };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
