import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ResponseMessage } from "../contrain/ResponseMessageContrain";
export const dtoValidate=(schama:ZodSchema)=>
(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body)
    try {
        const result=schama.safeParse(req.body)
        console.log(result)
        if(!result.success){
           res.status(400).json({message:ResponseMessage.VALIDATOR_RESPONSE})
           return
        }
        req.body=result.data
        next()
    } catch (error) {
        next(error)
    }
}