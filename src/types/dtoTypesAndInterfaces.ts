// types //////////////

import { IAbuserReport, IExtentedMatchProfile, IMessageOuput, IUserDatasForAdmin } from "./TypesAndInterfaces";
import {  IuserProfileReturnType, User } from "./UserRelatedTypes";

export type planDTODataType={ name: string; duration: number; features: string[]; amount: string; connect: string }[]







// interfacesss//
export interface IPlanDTO{
    plans: planDTODataType|[]
}

export interface IUserInfoDTO{
    processedData: IUserDatasForAdmin[]
    
}
export interface IAbuseMessageDTO{
    messagesDatas: IAbuserReport[]|[]
}
export interface IUserDTO{
  userData: Omit<User, "password">
 
}
export interface IUserFetchDataDTO{
    withAge: IuserProfileReturnType
} 
export interface IParternDataChatListDTO{
    connectedParterns: Omit<IExtentedMatchProfile, "lastName">[] | []
    Places: string[]|[]
    onlines: string[]|[]
}
export interface IMessageDTO{
    message: IMessageOuput
}
