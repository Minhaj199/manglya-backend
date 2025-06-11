
import { PlanOrdersEntity } from "../../types/TypesAndInterfaces.ts" 

export  interface User{
    PersonalInfo:{
        firstName:string,
        secondName:string,
        state:string,
        gender:string,
        dateOfBirth:Date
        image?:string
        interest?:string[]
    },
    partnerData:{
        gender:string
    },
    email:string,
    password:string
    block:boolean
    CurrentPlan?:PlanOrdersEntity
    PlanData?:string[]
    match:string[],
    subscriber:string
    CreatedAt:Date
}

