var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
export class JWTAdapter {
    constructor(tokenRepo) {
        this.tokenRepo = tokenRepo;
    }
    createAccessToken(information, key, option) {
        try {
            const { id, role, preferedGender = 'no parnter', gender = 'not available' } = information;
            const token = jwt.sign({ id, role, preferedGender, gender }, key, option);
            return token;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    createRefreshToken(information, key, option) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, role } = information;
                const token = jwt.sign({ id, role }, key, option);
                yield this.tokenRepo.create({ userId: new Types.ObjectId(id.slice(1, 25)), token: token });
                return token;
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        });
    }
    verifyAccessToken(token, from) {
        try {
            if (from === 'admin') {
                const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET_ADMIN || '123');
                return decode;
            }
            else if (from === 'user') {
                const decode = jwt.verify(token, process.env.JWT__ACCESS_SECRET_USER || '123');
                return decode;
            }
            else {
                throw new Error('error on validation');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    verifyRefreshToken(token, from) {
        try {
            if (from === 'user') {
                const decode = jwt.verify(token, process.env.JWT__REFRESH_SECRET_USER || '123');
                if (decode) {
                    const parsed = decode;
                    return parsed.id.slice(1, 25);
                }
                return decode;
            }
            else {
                throw new Error('error on token verification');
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    decodeAccessToken(token) {
        try {
            const data = jwt.decode(token);
            if (typeof data === 'object') {
                const parsed = data;
                return parsed.id.slice(1, 25);
            }
            else {
                throw new Error('error on id exraction');
            }
        }
        catch (error) {
            console.log(error);
            throw new Error('error on id exraction');
        }
    }
    decodeRefreshToken(token) {
        try {
            const data = jwt.decode(token);
            if (typeof data === 'object') {
                const parsed = data;
                return parsed.id.slice(1, 25);
            }
            else {
                throw new Error('error on id exraction');
            }
        }
        catch (error) {
            throw new Error('error on id exraction');
        }
    }
    fetchRefreshToken(extractId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token || typeof token !== 'string' || !extractId || typeof extractId !== 'string') {
                    throw new Error('refresh token not found');
                }
                const response = yield this.tokenRepo.fetchToken(extractId, token);
                return response;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteRefreshToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.tokenRepo.deleteToken(id, token);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
