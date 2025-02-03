var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWTAdapter } from "../../Infrastructure/jwt.js";
import { TokenRepository } from "../../Infrastructure/repositories/otherRepo.js";
const jwtAdmpter = new JWTAdapter(new TokenRepository());
export const userJwtAuthenticator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authforuser"];
    const refresh = req.headers["refreshauthforuser"];
    if (token && typeof token === "string") {
        try {
            const decode = jwtAdmpter.verifyAccessToken(token, "user");
            if (typeof decode === "string") {
                res.json({ message: "token is not valid,please log out", status: 301 });
            }
            const isValid = decode;
            const currentTime = Math.floor(Date.now() / 1000);
            if (isValid && isValid.role === "user") {
                if (isValid.exp && isValid.exp > currentTime) {
                    req.userID = isValid.id.slice(1, 25);
                    req.gender = isValid.gender;
                    req.preferedGender = isValid.preferedGender;
                    next();
                }
                else {
                    res.status(200).json({ message: "Token expired", status: 301 });
                }
            }
            else {
                res.json({ message: "validation Faild,please log out 51", status: 301 });
            }
        }
        catch (error) {
            if (refresh && typeof refresh === "string" && error.message === 'jwt expired') {
                res.status(402);
            }
            res.json({
                message: (error === null || error === void 0 ? void 0 : error.TokenExpiredError) || "validation Faild,please log out",
                status: 301,
            });
        }
    }
    else {
        res.status(200).json({ message: "validation Faild,please log out", status: 301 });
    }
});
