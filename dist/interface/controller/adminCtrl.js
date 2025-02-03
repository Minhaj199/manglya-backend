var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PlanRepository } from "../../Infrastructure/repositories/planRepositories.js";
import { resportAbuserService } from "../routes/userRoutes.js";
const planRepo = new PlanRepository();
export const login = (req, res, adminAuth) => {
    try {
        const { email, password } = req.body;
        const isValid = adminAuth.login(email, password);
        if ((isValid === null || isValid === void 0 ? void 0 : isValid.message) === 'admin verified') {
            res.json({ adminVerified: true, token: isValid.token });
        }
        else if ((isValid === null || isValid === void 0 ? void 0 : isValid.message) === 'password not matching') {
            res.json({ password: isValid.message });
        }
        else if ((isValid === null || isValid === void 0 ? void 0 : isValid.message) === 'user name not found') {
            res.json({ username: 'user name not found' });
        }
    }
    catch (error) {
        if (error.message === 'user name not found') {
            res.json({ username: error.message });
        }
        if (error.message === "password not matching") {
            res.json({ password: error.message });
        }
    }
};
export const fetechData = (req, res, userService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.from && req.query.from === 'subscriber') {
            const getSubscriberData = yield userService.fetchSubscriberDetailforAdmin();
            res.json(getSubscriberData);
        }
        else if (req.query.from && req.query.from === 'user') {
            const processedData = yield userService.fetchUserDatasForAdmin();
            res.json(processedData);
        }
    }
    catch (error) {
        console.log(error);
    }
});
export const userBlockAndUnblock = (req, res, userService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.blockAndBlock(req.body.id, req.body.updateStatus);
        if (response) {
            res.json({ message: 'updated' });
        }
        else {
            throw new Error('error on updation');
        }
    }
    catch (error) {
        console.log(error);
    }
});
export const addPlan = (req, res, planService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = { name: req.body.datas.name, features: req.body.handleFeatureState,
            amount: req.body.datas.amount, connect: req.body.datas.connect, duration: parseInt(req.body.datas.duration) };
        const response = yield planService.createPlan(plan);
        res.json({ status: response });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const fetechPlanData = (req, res, planService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield planService.fetchAll();
        res.json({ plans });
    }
    catch (error) {
        res.json(error.message);
    }
});
export const editPlan = (req, res, planService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield planService.editPlan(req.body);
        res.json({ response });
    }
    catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
});
export const softDlt = (req, res, planService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id) {
            const response = yield planService.softDelete(req.body.id);
            res.json({ response: response });
        }
        else {
            throw new Error('id not found');
        }
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const fetchFeature = (req, res, interestService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield interestService.fetchFeature();
        if (response) {
            res.json({ features: response.features });
        }
        else {
            throw new Error("feature not found");
        }
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const fetchDashData = (req, res, dashService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.from === 'dashCount') {
            const getDashBoardDatas = yield dashService.dashCount();
            res.json(getDashBoardDatas);
        }
        else if (req.query.from === 'SubscriberCount') {
            const getDashBoardDatas = yield dashService.SubscriberCount();
            res.json(getDashBoardDatas);
        }
        else if (req.query.from === 'Revenue') {
            const getDashBoardDatas = yield dashService.revenueForGraph();
            res.json(getDashBoardDatas);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
export const sendWarningMails = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sendWarningMale = yield reportAbuseService.sendWarningMail(req.body.reporter, req.body.reported, req.body.docId);
        res.json({ data: sendWarningMale });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const getReports = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchReport = yield reportAbuseService.getAllMessages();
        res.json({ data: fetchReport });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const blockAbuser = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchReport = yield reportAbuseService.blockReportedUser(req.body.reporter, req.body.reported, req.body.docId);
        res.json({ data: fetchReport });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const rejecReport = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchReport = yield resportAbuserService.rejectReport(req.body.reporter, req.body.reported, req.body.docId);
        res.json({ data: fetchReport });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const reportToggle = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetchReport = yield reportAbuseService.toggleReportRead(req.body.id, req.body.status);
        res.json({ data: fetchReport });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
export const deleteMsg = (req, res, reportAbuseService) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield reportAbuseService.deleteMessage(req.body.id);
        res.json({ data: response });
    }
    catch (error) {
        res.json({ message: error.message });
    }
});
