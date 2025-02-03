import { JWTAdapter } from "../../Infrastructure/jwt.js";
import { TokenRepository } from "../../Infrastructure/repositories/otherRepo.js";
const jwtAdmpter = new JWTAdapter(new TokenRepository);
export const adminJwtAuthenticator = (req, res, next) => {
    const token = req.headers['authorizationforadmin'];
    if (token && typeof token === 'string') {
        try {
            const decode = jwtAdmpter.verifyAccessToken(token, 'admin');
            const isValid = decode;
            if (typeof decode === 'string') {
                res.json({ message: 'token is not valid', name: 'authentication failed' });
            }
            const currentTime = Math.floor(Date.now() / 1000);
            if (isValid && isValid.id === '123' && isValid.role === 'admin') {
                if (isValid.exp && isValid.exp > currentTime) {
                    next();
                }
                else {
                    res.json({ message: 'validation Faild', name: 'authentication failed' });
                }
            }
            else {
                res.json({ message: 'validation Faild', name: 'authentication failed' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(405).json({ message: error.message || 'validation Faild', name: 'authentication failed' });
            }
            else {
                console.log('error is not getting');
            }
        }
    }
    else {
        res.status(405).json({ message: 'validation Faild', name: 'authentication failed' });
    }
};
