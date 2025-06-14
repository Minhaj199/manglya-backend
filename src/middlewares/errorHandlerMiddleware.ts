import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../types/customErrorClass"; 
import mongoose from "mongoose";
import { HttpStatus } from "../contrain/statusCodeContrain";

export const globalErrorHandler:ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next:NextFunction
) => {
  if (err instanceof AppError) {
    console.log(err)
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
     return
  }
   if (err instanceof Error&&'code' in err &&err.code===11000) {
     res.status(HttpStatus.BAD_REQUEST).json({ message: err.message||'Duplicate Data' });
     return
  }
  if (err instanceof mongoose.Error.ValidationError) {
 res
      .status(400)
      .json({ message: "Validation Error", errors: err.errors });
      return
  }
  if(err instanceof Error){
      res.status(500).json({ message: err.message||"Unexpected error occurred" });
      return
}
res.status(500).json({ message: "Unexpected error occurred" });
  next()
};
