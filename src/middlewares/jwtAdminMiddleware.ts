import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../utils/jwtAdapter.ts";
import { TokenRepository } from "../repository/implimention/otherRepository.ts";
import { jwtInterface } from "../types/TypesAndInterfaces.ts";
import { ResponseMessage } from "../constrain/ResponseMessageContrain.ts";
import { HttpStatus } from "../constrain/statusCodeContrain.ts";

const jwtAdmpter = new JWTAdapter(new TokenRepository());
export const adminJwtAuthenticator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorizationforadmin"];

  if (token && typeof token === "string") {
    try {
      const decode = jwtAdmpter.verifyAccessToken(token, "admin");
      const adminID = process.env.ADMIN_ID;
      const isValid = decode as jwtInterface;
      if (typeof decode === "string") {
        res.json({
          message: "token is not valid",
          name: ResponseMessage.AUTHENTICATION_FAILD,
        });
      }
      const currentTime = Math.floor(Date.now() / 1000);
      if (isValid && isValid.id === adminID && isValid.role === "admin") {
        if (isValid.exp && isValid.exp > currentTime) {
          next();
        } else {
          res.json({
            message: ResponseMessage.VALIDATION_FAILED,
            name: ResponseMessage.AUTHENTICATION_FAILD,
          });
        }
      } else {
        res.json({
          message: ResponseMessage.VALIDATION_FAILED,
          name: ResponseMessage.AUTHENTICATION_FAILD,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: error.message || ResponseMessage.VALIDATION_FAILED,
          name: ResponseMessage.AUTHENTICATION_FAILD,
        });
      } else {
        throw new Error("error is not getting");
      }
    }
  } else {
    res
      .status(405)
      .json({
        message: ResponseMessage.VALIDATION_FAILED,
        name: ResponseMessage.AUTHENTICATION_FAILD,
      });
  }
};
