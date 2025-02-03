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
import { EmailService } from "../../Infrastructure/emailService.js";
import { UserRepsitories } from "../../Infrastructure/repositories/userRepository.js";
export class ReportAbuseService {
    constructor(reportRepo, emailService, userRepo) {
        this.emailService = new EmailService();
        this.userRepo = new UserRepsitories();
        this.reportRepo = reportRepo;
        this.emailService = emailService;
        this.userRepo = userRepo;
    }
    checkingDupliacateComplaint(id, reason, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield this.reportRepo.findComplain(id, reason, profileId);
                return check;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createReport(userId, reporedId, reason, moreInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof userId === 'string' && typeof reporedId === 'string') {
                    const isDuplicate = yield this.checkingDupliacateComplaint(userId, reason, reporedId);
                    if (!isDuplicate) {
                        const data = {
                            reporter: new Types.ObjectId(userId),
                            reported: new Types.ObjectId(reporedId),
                            reason,
                            moreInfo,
                            rejected: false,
                            block: false,
                            read: false,
                            warningMail: false
                        };
                        const response = yield this.reportRepo.create(data);
                        if (response) {
                            return true;
                        }
                        else {
                            throw new Error('internal server error');
                        }
                    }
                    else {
                        throw new Error('complaint already taken on specified reason');
                    }
                }
                else {
                    throw new Error('type miss match on ids');
                }
            }
            catch (error) {
                throw new Error(error.message || 'error on reporting user');
            }
        });
    }
    sendWarningMail(reporter, reported, reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportedEmail = yield this.userRepo.findEmailByID(reported);
                const reporterEmail = yield this.userRepo.findEmailByID(reporter);
                const matter = `Dear user,
         this warning male from mangalya matrimonial. You have been reported for abusive acts,please do keep our guid lines
         `;
                const matterToReporter = `Dear user,
          Sorry to hear that you got bad experience from another user,we took action the abuser took action in your case`;
                yield this.emailService.sendEmail(reportedEmail.email, 'warning male from mangalya', matter);
                yield this.emailService.sendEmail(reporterEmail.email, 'Problem Resolve-mangalya', matterToReporter);
                const response = yield this.reportRepo.update(reportId, 'warningMail', true);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    blockReportedUser(reporter, reported, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportedEmail = yield this.userRepo.findEmailByID(reported);
                const reporterEmail = yield this.userRepo.findEmailByID(reporter);
                const matter = `Dear user,
             this warning male from mangalya matrimonial. You have been reported from abusive acts,your account suspended till further update
             `;
                const matterToReporter = `Dear user,
              Sorry to hear that you got bad experience from another user,we took action the abuser took action in your case`;
                yield this.emailService.sendEmail(reportedEmail.email, 'warning male from mangalya', matter);
                yield this.emailService.sendEmail(reporterEmail.email, 'Problem Resolve-mangalya', matter);
                const response = yield this.reportRepo.update(docId, 'block', true);
                yield this.userRepo.blockAndUnblockUser(reported, true);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getAllMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.reportRepo.getMessages();
                return response;
            }
            catch (error) {
                throw new Error(error.message || 'error on fetching reports');
            }
        });
    }
    rejectReport(reporter, reported, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reporterEmail = yield this.userRepo.findEmailByID(reporter);
                const matterToReporter = `Dear user,
      Sorry to hear that you got bad experience for another user,after thorough checking that,
      the specifed user not violated any guidelines,please connect us,strill you feeling any disconfort`;
                yield this.emailService.sendEmail(reporterEmail.email, 'Problem Resolve-mangalya', matterToReporter);
                const response = yield this.reportRepo.update(docId, 'rejected', true);
                yield this.reportRepo.update(docId, 'block', true);
                yield this.reportRepo.update(docId, 'warningMail', true);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    toggleReportRead(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.reportRepo.update(id, 'read', status);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.reportRepo.delete(id);
                return response;
            }
            catch (error) {
                throw new Error(error.message || 'error on deletion');
            }
        });
    }
}
