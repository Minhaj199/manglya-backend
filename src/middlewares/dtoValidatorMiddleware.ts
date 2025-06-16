import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ResponseMessage } from "../constrain/ResponseMessageContrain";
import { HttpStatus } from "../constrain/statusCodeContrain";
export const    dtoValidate=(schama:ZodSchema)=>
(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log(req.body)
        const result=schama.safeParse((req.method==='GET')?req.query:req.body)
        if(!result.success){
            if(result.error instanceof ZodError){
                console.log(result.error.issues)
                res.status(HttpStatus.BAD_REQUEST).json({message:result.error.issues[0].message})
                return
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:ResponseMessage.VALIDATOR_RESPONSE})
                return
            }
        }
        console.log(result.data)
        req.body=result.data
        next()
    } catch (error) {
        next(error)
    }
}
//   email: 'fdajkfalj@gmail.com',
//   interest: '["Football","Cricket"]'
// }
// {
//   responseFromAddinInterest: true,
//   url: 'https://res.cloudinary.com/dyomgcbln/image/upload/v1750054382/mangalya/vlnywvtmsypmemlkdyk4.avif'
// }