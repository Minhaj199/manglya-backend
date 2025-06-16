import { Types } from "mongoose"
import { AppError } from "../types/customErrorClass"


export function userIDValidator(id:unknown){
    try {
        if(!id){
            throw new Error('user id not found')
        }
        const parsedId=id as string
        return Types.ObjectId.isValid(parsedId)
    } catch  {
        throw new AppError('id not found',404)
    }
}