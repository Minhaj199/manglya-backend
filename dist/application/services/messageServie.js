var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class MessageService {
    constructor(messageRepo, chatRepositroy, photoCloud, userRepo) {
        this.messageRepo = messageRepo;
        this.chatRepositroy = chatRepositroy;
        this.photoCloud = photoCloud;
        this.userRepo = userRepo;
    }
    createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.messageRepo.create(data);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findAllMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const get_All_Messages = yield this.messageRepo.findAllMessage(id);
                if ((get_All_Messages === null || get_All_Messages === void 0 ? void 0 : get_All_Messages.length) > 0) {
                    const final = get_All_Messages.map((message) => {
                        return {
                            senderId: message.receiverId,
                            text: message.text,
                            image: message.image,
                            createdAt: message.createdAt,
                        };
                    });
                    yield this.updateReadedMessage(id);
                    return final;
                }
                yield this.updateReadedMessage(id);
                return get_All_Messages;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    updateReadedMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.messageRepo.updateReadedMessage(id);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchMessageCount(from, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof from === "string" && typeof id === "string") {
                    const response = yield this.chatRepositroy.fetchDatasForCount(id);
                    if (response.length >= 1) {
                        const ids = [];
                        response.forEach((el) => {
                            ids.push(el.chats._id);
                        });
                        if (ids.every((el) => typeof el === "string")) {
                            return { count: ids.length, ids: ids };
                        }
                        else {
                            return { count: ids.length, ids: [] };
                        }
                    }
                    else {
                        return { count: 0, ids: [] };
                    }
                }
                else {
                    throw new Error("error id type missmatch");
                }
            }
            catch (error) {
                throw new Error(error.message || "error fetching message count");
            }
        });
    }
    makeAllUsersMessageReaded(from, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof from === "string") {
                    if (from === "nav") {
                        yield this.messageRepo.updatAllMessagesReaded(ids);
                        return true;
                    }
                    else {
                        return false;
                    }
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
    createImageUrl(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.photoCloud.upload(path);
                if (typeof response === "string") {
                    return response;
                }
                else {
                    return "";
                }
            }
            catch (error) {
                throw new Error(error.message || "error on photo upload");
            }
        });
    }
    findNewMessages(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== "string") {
                throw new Error("id not found");
            }
            try {
                const ids = yield this.userRepo.findPartnerIds(id);
                const response = yield this.messageRepo.findNewMessages(id, ids);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
