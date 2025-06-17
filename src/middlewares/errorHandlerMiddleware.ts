import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../types/customErrorClass";
import mongoose from "mongoose";
import { HttpStatus } from "../constrain/statusCodeContrain";
import logger from "../config/winstonConfig";
import { ResponseMessage } from "../constrain/ResponseMessageContrain";

export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedError = err as Error;
  logger.error({
    message: parsedError.message,
    stack: parsedError.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    time: new Date().toISOString(),
  });
  if (err instanceof AppError) {
    res.status(err.statusCode||HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    return;
  }
  if (err instanceof Error && "code" in err && err.code === 11000) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: err.message || "Duplicate Data" });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: "Validation Error", errors: err.errors });
    return;
  }
  if (err instanceof Error) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: err.message ||ResponseMessage.SERVER_ERROR });
    return;
  }
  res.status(500).json({ message: ResponseMessage.SERVER_ERROR });
  next();
};
