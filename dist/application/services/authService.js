var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotEnv from "dotenv";
dotEnv.config();
///////////////checking completed/////////////////
export class AuthService {
    constructor(userRepository, bcryptAdapter, jwtGenerator) {
        this.bcryptAdapter = bcryptAdapter;
        this.jwtGenerator = jwtGenerator;
        this.userRepository = userRepository;
    }
    signupFirstBatch(firstBatch) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassoword = yield this.bcryptAdapter.hash(firstBatch.PASSWORD);
            const user = {
                PersonalInfo: {
                    firstName: firstBatch["FIRST NAME"],
                    secondName: firstBatch["SECOND NAME"],
                    state: firstBatch["DISTRICT THAT YOU LIVE"],
                    gender: firstBatch["YOUR GENDER"],
                    dateOfBirth: new Date(firstBatch["DATE OF BIRTH"]),
                },
                partnerData: {
                    gender: firstBatch["GENDER OF PARTNER"],
                },
                email: firstBatch.EMAIL,
                password: hashedPassoword,
                block: false,
                match: [],
                PlanData: [],
                subscriber: "Not subscribed",
                CreatedAt: new Date(),
            };
            try {
                const response = yield this.userRepository.create(user);
                if (response && response._id) {
                    const key = process.env.JWT__ACCESS_SECRET_USER || "123";
                    const id = JSON.stringify(response._id) || "123";
                    const preferedGender = response.partnerData.gender;
                    const gender = response.PersonalInfo.gender;
                    const accessToken = this.jwtGenerator.createAccessToken({ id: id, role: "user", preferedGender, gender }, key, { expiresIn: "15m" });
                    const refreshToken = yield this.jwtGenerator.createRefreshToken({ id, role: "user" }, process.env.JWT__REFRESH_SECRET_USER || "", { expiresIn: "1d" });
                    return { user, token: accessToken, refreshToken };
                }
                else {
                    throw new Error("internal server error on signup");
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user) {
                    throw new Error("user not found");
                }
                if (user) {
                    const isMatch = yield this.bcryptAdapter.compare(password, user.password);
                    if (isMatch) {
                        const preferedGender = user.partnerData.gender;
                        const gender = user.PersonalInfo.gender;
                        const jwt_access_key = process.env.JWT__ACCESS_SECRET_USER || "";
                        const jwt_refresh_key = process.env.JWT__REFRESH_SECRET_USER || "";
                        if (!jwt_access_key || (jwt_access_key === null || jwt_access_key === void 0 ? void 0 : jwt_access_key.trim()) === "") {
                            throw new Error("user access key not found");
                        }
                        if (!jwt_refresh_key || (jwt_refresh_key === null || jwt_refresh_key === void 0 ? void 0 : jwt_refresh_key.trim()) === "") {
                            throw new Error("user refresh` key not found");
                        }
                        const accessToken = this.jwtGenerator.createAccessToken({
                            id: JSON.stringify(user._id),
                            role: "user",
                            preferedGender,
                            gender,
                        }, jwt_access_key, { expiresIn: "15m" });
                        const refreshToken = yield this.jwtGenerator.createRefreshToken({ id: JSON.stringify(user._id), role: "user" }, jwt_refresh_key, { expiresIn: "1d" });
                        const photo = user.PersonalInfo.image || "";
                        return {
                            token: accessToken,
                            refresh: refreshToken,
                            name: user.PersonalInfo.firstName,
                            partner: user.partnerData.gender,
                            photo: photo,
                            gender: user.PersonalInfo.gender,
                            subscriptionStatus: user.subscriber,
                        };
                    }
                    else {
                        throw new Error("password not matched");
                    }
                }
                else {
                    throw new Error("user not found");
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    passwordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                throw new Error("insuficient datas");
            }
            try {
                const hashed = yield this.bcryptAdapter.hash(password);
                if (email && hashed) {
                    const response = yield this.userRepository.changePassword(email, hashed);
                    return response;
                }
                else {
                    throw new Error("error on password reseting");
                }
            }
            catch (error) {
                throw new Error("error on password reseting");
            }
        });
    }
    changePasswordEditProfile(password, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof password !== "string" || typeof id !== "string") {
                throw new Error("error on password changing");
            }
            try {
                const email = yield this.userRepository.findEmailByID(id);
                if (!email) {
                    throw new Error("error on password changing");
                }
                const response = yield this.passwordChange(email === null || email === void 0 ? void 0 : email.email, password);
                return response;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    regenerateToken(id, role, preferedGender, gender) {
        if (typeof id !== "string") {
            throw new Error("error on id");
        }
        try {
            const information = {
                id,
                role,
                preferedGender,
                gender,
            };
            const newToken = this.jwtGenerator.createAccessToken(information, role === "admin"
                ? process.env.JWT_ACCESS_SECRET_ADMIN || ""
                : process.env.JWT__ACCESS_SECRET_USER || "", { expiresIn: "15m" });
            return newToken;
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    getNewToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof refreshToken !== "string") {
                    throw new Error("token not found");
                }
                const extractId = this.jwtGenerator.verifyRefreshToken(refreshToken, "user");
                if (!extractId) {
                    throw new Error("refresh token is not valid");
                }
                const token = yield this.jwtGenerator.fetchRefreshToken(extractId, refreshToken);
                if (token) {
                    const newToken = this.jwtGenerator.createAccessToken({
                        id: JSON.stringify(token.userId._id),
                        role: "user",
                        preferedGender: token.userId.partnerData.gender,
                        gender: token.userId.PersonalInfo.gender,
                    }, process.env.JWT__ACCESS_SECRET_USER || "", { expiresIn: "15m" });
                    return newToken;
                }
                else {
                    throw new Error("refreshTokenNotFount");
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    userLoggedOut(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || typeof id !== "string") {
                    throw new Error("token not found");
                }
                if (!token || typeof token !== 'string') {
                    throw new Error("token not found");
                }
                yield this.jwtGenerator.deleteRefreshToken(id, token);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
