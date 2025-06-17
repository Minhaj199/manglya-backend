/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../utils/jwtAdapter";
import { TokenRepository } from "../repository/implimention/otherRepository";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../constrain/statusCodeContrain";

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
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "token is not valid,please log out", status: HttpStatus.BAD_REQUEST });
      }
      const isValid = decode as JwtPayload;
      const currentTime = Math.floor(Date.now() / 1000);
      if (isValid && isValid.role === "user") {
        if (isValid.exp && isValid.exp > currentTime) {
          req.userID = isValid.id.slice(1, 25);
          req.gender = isValid.gender;
          req.preferedGender = isValid.preferedGender;
          next();
        } else {
          res.status(HttpStatus.FORBIDDEN).json({ message: "Token expired", status: HttpStatus.BAD_REQUEST });
        }
      } else {
        res
          .json(HttpStatus.FORBIDDEN)
          .json({ message: "validation Faild,please log out ", status: HttpStatus.FORBIDDEN });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        refresh &&
        typeof refresh === "string" &&
        error.message === "jwt expired"
      ) {
      

        res.status(HttpStatus.FORBIDDEN).json("access token expired");
        return;
      }
      if (error instanceof Error && "TokenExpiredError" in error) {
        
        
        res.status(HttpStatus.FORBIDDEN).json({
          message:
            error?.TokenExpiredError || "validation Faild,please log out",
          status: HttpStatus.BAD_REQUEST,
        });
        return;
      } else {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "validation Faild,please log out", status: HttpStatus.BAD_REQUEST });
        return;
      }
    }
  }
};
