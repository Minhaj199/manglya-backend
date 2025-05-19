import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../../Infrastructure/jwt.js";
import { TokenRepository } from "../../Infrastructure/repositories/otherRepo.js";
export interface jwtInterface {
  id: string;
  preferedGender: string;
  gender: string;
  role: string;
  iat?: number;
  exp?: number;
}
declare global {
  namespace Express {
    interface Request {
      userID?: string;
      preferedGender: string;
      gender: string;
    }
  }
}
const jwtAdmpter = new JWTAdapter(new TokenRepository());
export const userJwtAuthenticator = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authforuser"];
  const refresh = req.headers["refreshauthforuser"];
  if (token && typeof token === "string") {
    try {
      const decode = jwtAdmpter.verifyAccessToken(token, "user");
      if (typeof decode === "string") {
        res.json({ message: "token is not valid,please log out", status: 301 });
      }
      const isValid = decode as jwtInterface;
      const currentTime = Math.floor(Date.now() / 1000);
      if (isValid && isValid.role === "user") {
        if (isValid.exp && isValid.exp > currentTime) {
          req.userID = isValid.id.slice(1, 25);
          req.gender = isValid.gender;
          req.preferedGender = isValid.preferedGender;
          next();
        } else {
          
          res.status(200).json({ message: "Token expired", status: 301 })
        }
      } else {
        
       
        res.json({ message: "validation Faild,please log out 51", status: 301 });
      }
    } catch (error: any) {
        
        if (refresh && typeof refresh === "string"&&error.message==='jwt expired') {
            res.status(402)
          }
      res.json({
        message: error?.TokenExpiredError || "validation Faild,please log out",
        status: 301,
      });
    }
  } else {
    res.status(200).json({ message: "validation Faild,please log out", status: 301 });
  }
};
