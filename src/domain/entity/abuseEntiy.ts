import { Types } from "mongoose"

export interface AbuserReport{
    reporter:Types.ObjectId
    reported:Types.ObjectId
    read:boolean
    reason:string
    moreInfo:string
    warningMail:boolean
    block:boolean
    rejected:boolean
}

