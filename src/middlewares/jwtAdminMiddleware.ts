import { Request, Response, NextFunction } from "express";
import { JWTAdapter } from "../utils/jwtAdapter.ts";
import { TokenRepository } from "../repository/implimention/otherRepository.ts";
import { jwtInterface } from "../types/TypesAndInterfaces.ts";

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
          name: "authentication failed",
        });
      }
      const currentTime = Math.floor(Date.now() / 1000);
      if (isValid && isValid.id === adminID && isValid.role === "admin") {
        if (isValid.exp && isValid.exp > currentTime) {
          next();
        } else {
          res.json({
            message: "validation Faild",
            name: "authentication failed",
          });
        }
      } else {
        res.json({
          message: "validation Faild",
          name: "authentication failed",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(405).json({
          message: error.message || "validation Faild",
          name: "authentication failed",
        });
      } else {
        throw new Error("error is not getting");
      }
    }
  } else {
    res
      .status(405)
      .json({ message: "validation Faild", name: "authentication failed" });
  }
};
