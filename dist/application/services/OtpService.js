var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateOTP } from "../../interface/utility/otpGenerator.js";
export class OtpService {
    constructor(userRepository, otpRepository, emailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    ForgetValidateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = yield this.userRepository.findEmail(email);
                return isValid;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    otpVerification(email, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield generateOTP();
                const isCreated = yield this.otpRepository.create({ otp, email, from });
                yield this.emailService.sendEmail(email, "Signup MANGALYA OTP", `Welcome to Mangalya. Your Signup OTP for Authentication is <h1>${otp}<h1/>`);
                if (isCreated) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error("error on otp authentication");
            }
        });
    }
    otpVerificationForForgot(email, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield generateOTP();
                const otpReponse = yield this.otpRepository.create({ otp, email, from: from });
                const subject = "Password Reseting";
                yield this.emailService.sendEmail(email, subject, `Welcome to Mangalya. Your password reset OTP for Authentication is <h1>${otp}<h1/>`);
                if (otpReponse) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw new Error("error on otp authentication");
            }
        });
    }
    otpValidation(email, otp, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.otpRepository.getOTP(email, from);
                if (Array.isArray(response)) {
                    return false;
                }
                else {
                    const parsedOTP = Number(otp);
                    if (response.email === email && response.otp === parsedOTP) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                throw new Error("otp falure");
            }
        });
    }
    otpDispatchingForEditProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof id !== "string") {
                    throw new Error("Invalid ID format");
                }
                const getEmail = yield this.userRepository.findEmailByID(id);
                if (!getEmail) {
                    throw new Error("Email not found");
                }
                const sentEmail = yield this.otpVerificationForForgot(getEmail.email, "forgot");
                yield Promise.all([getEmail, sentEmail]);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    validateOtpForEditProfiel(id, otp, from) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== "string" || typeof otp !== "string") {
                throw new Error("error on validation");
            }
            try {
                const email = yield this.userRepository.findEmailByID(id);
                if (email === null || email === void 0 ? void 0 : email.email) {
                    const isValid = yield this.otpRepository.getOTP(email.email, from);
                    if (Array.isArray(isValid)) {
                        return "OTP not found";
                    }
                    else {
                        const result = Number(otp || 123657) === isValid.otp;
                        if (result) {
                            return "opt matched";
                        }
                        else {
                            return "Not valid otp";
                        }
                    }
                }
                else {
                    throw new Error("internal server error,otp not found");
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    }
}
