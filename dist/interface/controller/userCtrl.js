var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
import { UserRepsitories } from "../../Infrastructure/repositories/userRepository.js";
const userRep = new UserRepsitories;
export const signup = (req, res, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authService.signupFirstBatch(req.body);
        res.setHeader('authorizationforuser', user === null || user === void 0 ? void 0 : user.refreshToken);
        res.status(201).json({ message: 'sign up completed', token: user === null || user === void 0 ? void 0 : user.token });
    }
    catch (error) {
        if (error) {
            if (error.code === 11000) {
                res.json({ message: 'Email already exist', status: false });
            }
            else {
                res.json({ message: error.message || 'error on signup please try again' });
            }
        }
    }
});
export const otpCreation = (req, res, authService, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, from } = req.body;
    if (from === 'forgot') {
        try {
            const response = yield otpService.otpVerificationForForgot(email, from);
            if (response) {
                if (response) {
                    res.status(200).json({ message: 'Email send successfull' });
                }
            }
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        try {
            const response = yield otpService.otpVerification(email, req.body.from);
            if (response) {
                res.status(200).json({ message: 'Email send successfull' });
            }
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }
});
export const login = (req, res, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield authService.login(email, password);
        const { token, refresh, name, photo, partner, gender, subscriptionStatus } = response;
        res.setHeader('authorizationforuser', refresh);
        res.status(200).json({ message: 'password matched', token, refresh, name, photo, partner, gender, subscriptionStatus });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const fetechProfileData = (req, res, partnersProfileService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userID) {
            const response = yield partnersProfileService.fetchProfileData(req.userID, req.gender, req.preferedGender);
            res.json(response);
        }
        else {
            throw new Error('id not found');
        }
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const forgotCheckValidate = (req, res, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof req.query.email === 'string') {
            let decoded = decodeURI(req.query.email);
            const email = decoded;
            const isValid = yield otpService.ForgetValidateEmail(email);
            if (isValid) {
                const response = yield otpService.otpVerificationForForgot(email, 'forgot');
                if (response) {
                    res.json({ email: isValid.email });
                }
            }
            else {
                res.json(false);
            }
        }
    }
    catch (error) {
        res.json(error);
    }
});
export const forgotCheckValidateSigunp = (req, res, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const isValid = yield otpService.ForgetValidateEmail(email);
        if (isValid) {
            res.json({ email: isValid.email });
        }
        else {
            res.json(false);
        }
    }
    catch (error) {
        res.json(error);
    }
});
export const otpValidation = (req, res, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, from } = req.body;
        const isValid = yield otpService.otpValidation(email, otp, from);
        if (isValid) {
            res.json({ message: 'OTP valid' });
        }
        else {
            res.json({ message: 'OTP not valid' });
        }
    }
    catch (error) {
        res.json(error);
    }
});
export const changePassword = (req, res, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email } = req.body;
        const isValid = yield authService.passwordChange(email, password);
        if (isValid) {
            res.json({ message: 'password changed' });
        }
        else {
            res.json({ message: 'error on password' });
        }
    }
    catch (error) {
        res.json(error);
    }
});
export const secondBatch = (req, res, userProfileService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const obj = { responseFromAddinInterest: false, url: false };
    try {
        if (req.file && req.file.path) {
            const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || '';
            const response = (yield userProfileService.uploadPhoto(image, req.body.email)) || '';
            obj.url = response;
        }
        const interest = JSON.parse(req.body.interest);
        if (interest.length > 0) {
            const responseFromAddinInterest = yield userProfileService.uploadInterest(interest, req.body.email);
            obj.responseFromAddinInterest = responseFromAddinInterest;
        }
        res.json(obj);
    }
    catch (error) {
        res.json(error);
    }
});
export const addMatch = (req, res, patnerServiece) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield patnerServiece.addMatch(req.userID, req.body.matchId);
        res.json(response);
    }
    catch (error) {
        res.json(error);
    }
});
export const manageReqRes = (req, res, partnersProfileService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield partnersProfileService.manageReqRes(req.body.id, req.userID, req.body.action);
        if (response) {
            res.json({ message: 'changed' });
        }
        else {
            throw new Error('error on request management');
        }
    }
    catch (error) {
        res.json(error.message);
    }
});
export const fetchPlanData = (req, res, planService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield planService.fetchAll();
        res.json(data);
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const purchasePlan = (req, res, paymentSerivice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userID) {
            throw new Error('user id not found');
        }
        if (req.body.planData && req.body.token && req.body.token.email) {
            const response = yield paymentSerivice.purchase(req.body.planData, req.body.token, req.body.token.email, req.userID);
            res.json({ status: response });
        }
        else {
            res.json({ message: 'client side error' });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
});
export const fetchDataForProfile = (req, res, partnerServiece) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield partnerServiece.fetchUserForLandingShow();
        if (response) {
            res.json(response);
        }
        else {
            throw new Error('Error on new user data collection');
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
export const fetchInterest = (req, res, interestService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield interestService.fetchInterestAsCategory();
        if (response) {
            res.json({ Data: response });
        }
        else {
            throw new Error("Error on interst getting");
        }
    }
    catch (error) {
        res.json({ message: error.message || 'Error on message interest getting' });
    }
});
export const getUserProfile = (req, res, userProfileService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userProfileService.fetchUserProfile(req.userID);
        res.json({ user });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const otpForResetPassword = (req, res, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sentOtp = yield otpService.otpDispatchingForEditProfile(req.userID);
        res.json(sentOtp);
    }
    catch (error) {
        res.json(error.message || 'internal server error');
    }
});
export const otpForUserResetPassword = (req, res, otpService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = yield otpService.validateOtpForEditProfiel(req.userID, JSON.stringify(req.body.OTP), req.body.from);
        res.json({ status: validate });
    }
    catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
});
export const resetPassword = (req, res, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, confirmPassword } = req.body;
        if (password === confirmPassword) {
            const response = yield authService.changePasswordEditProfile(password, req.userID);
            res.json({ status: response });
        }
        else {
            throw new Error('Password not match');
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const editProfile = (req, res, userProfileService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            const email = yield userProfileService.fetchUserByID(req.userID);
            yield userProfileService.uploadPhoto(req.file.path, email);
            const updateDetail = yield userProfileService.updateEditedData(JSON.parse(req.body.data), req.userID);
            res.json({ status: true, newData: updateDetail });
        }
        else {
            const updateDetail = yield userProfileService.updateEditedData(JSON.parse(req.body.data), req.userID);
            if (typeof updateDetail === 'string') {
                res.json({ newData: updateDetail });
            }
            else {
                res.json({ newData: updateDetail });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.json({ message: error.messaeg || 'error on update' });
    }
});
export const matchedUser = (req, res, partnerServiece) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchMatchedUsers = yield partnerServiece.matchedProfiles(req.userID);
        if (fetchMatchedUsers) {
            res.json({ fetchMatchedUsers });
        }
        else {
            res.json(false);
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
export const deleteMatched = (req, res, partnerServiece) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const response = yield partnerServiece.deleteMatchedUser(req.userID, id);
        res.json({ status: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
export const reportAbuse = (req, res, reportAbuse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.reason || !req.body.moreInfo || !req.body.profileId) {
            throw new Error('In suficient data error');
        }
        const response = yield reportAbuse.createReport(req.userID, req.body.profileId, req.body.reason, req.body.moreInfo);
        if (typeof response === 'boolean') {
            res.json({ data: response });
        }
        else {
            res.json({ data: false });
        }
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const fetchSuggestion = (req, res, partnerServiece) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield partnerServiece.fetchSuggestions(req.userID, req.preferedGender, req.gender);
        res.json(result);
    }
    catch (error) {
        res.json({ message: error.messaeg || 'error on suggestion fetching' });
    }
});
export const getChats = (req, res, chatService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield chatService.fetchChats(req.body.id, req.userID);
        res.json(response);
    }
    catch (error) {
        res.json({ message: error.messaeg || 'error on chat fetching' });
    }
});
export const createTexts = (req, res, chatService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.chatId === '') {
            throw new Error('chat id not found');
        }
        const response = yield chatService.createMessage(req.body.chatId, req.body.senderIdString, req.body.receiverId, req.body.text, req.body.image);
        res.json({ newMessage: response });
    }
    catch (error) {
        console.log(error);
        res.json({ message: error.messaeg || 'error chat' });
    }
});
export const getMessages = (req, res, messageService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield messageService.findAllMessage(req.params.id);
        res.json(response);
    }
    catch (error) {
        res.json({ message: error.messaeg || 'error on chat fetching' });
    }
});
export const getuserForChat = (req, res, chatRoomService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield chatRoomService.fetchUserForChat(req.params.id);
        res.json(response);
    }
    catch (error) {
        res.json({ message: error.messaeg || 'error on chat fetching' });
    }
});
export const MsgCount = (req, res, messageService) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newMessagesForNav = yield messageService.fetchMessageCount((_a = req.query) === null || _a === void 0 ? void 0 : _a.from, req.userID);
        const newMessagesNotifiation = yield messageService.findNewMessages(req.userID);
        res.json({ newMessagesForNav, newMessagesNotifiation });
    }
    catch (error) {
        res.json({ count: 0 });
    }
});
export const MessageViewed = (req, res, messageRepo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield messageRepo.makeAllUsersMessageReaded(req.body.from, req.body.ids);
        res.json({ status: response });
    }
    catch (error) {
        res.json({ status: false });
    }
});
export const saveImage = (req, res, messageService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file && typeof req.file.path === 'string') {
            const getImgUrl = yield messageService.createImageUrl(req.file.path);
            res.json({ image: getImgUrl });
        }
        else {
            throw new Error('internal server error on photo send');
        }
    }
    catch (error) {
        res.json({ status: false });
    }
});
export const getNewToken = (req, res, authService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authService.getNewToken(req.body.refresh);
        if (response) {
            res.json({ token: response });
        }
        else {
            throw new Error('refresh token not found');
        }
    }
    catch (error) {
        res.json('error on validating token please login again');
    }
});
export const planHistoryAndRequest = (req, res, userProfile, planService) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.userID;
    try {
        if (typeof id !== 'string') {
            throw new Error('id not found');
        }
        const response = yield userProfile.findCurrentPlanAndRequests(id);
        const history = yield planService.fetchHistory(id);
        res.json(Object.assign(Object.assign({}, response), { history }));
    }
    catch (error) {
        res.json('error on validating token please login again');
    }
});
