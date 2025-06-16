import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ResponseMessage } from "../constrain/ResponseMessageContrain";
import { HttpStatus } from "../constrain/statusCodeContrain";
export const dtoValidate =
  (schama: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schama.safeParse(
        req.method === "GET" ? req.query : req.body
      );
      if (!result.success) {
        if (result.error instanceof ZodError) {
          res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: result.error.issues[0].message });
          return;
        } else {
          res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: ResponseMessage.VALIDATOR_RESPONSE });
          return;
        }
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
