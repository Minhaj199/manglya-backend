import {  ZodSchema } from "zod";
import { User } from "../types/UserRelatedTypes";
import { AppError } from "../types/customErrorClass";




export function zodDataValidator(data:User,schama:ZodSchema){
    try {
     const result=schama.safeParse(data)
    if(result.success){
        return result.data
    }else{
        throw new Error(result.error.issues[0].message)
    }     
    } catch (error) {
        if(error instanceof Error){
            throw new AppError(error.message,400)   
        }
    }
   
    }
