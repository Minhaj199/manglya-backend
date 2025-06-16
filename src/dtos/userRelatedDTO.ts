import { IUserDTO, IUserFetchData, IUserInfoDTO } from "../types/dtoTypesAndInterfaces";
import { IUserDatasForAdmin } from "../types/TypesAndInterfaces";
import { IuserProfileReturnType, IUserWithID,User, UserLinsting } from "../types/UserRelatedTypes";
import { getAge } from "../utils/ageCalculator";


//////////////////admin user management page data///////
export class UserInfoDTO implements IUserInfoDTO{
    processedData:IUserDatasForAdmin[]
    constructor(userData:UserLinsting){
        this.processedData=userData?.map((el, index) => ({
          ...el,
          expiry: el?.CreatedAt ? el.CreatedAt.toDateString() : el?.CreatedAt,
          no: index + 1,
        }))||[]
    }
}


/////////////////user for signup data///////

export class UserDTO implements IUserDTO{   
  userData:Omit<User,'password'>
 
  constructor(private readonly user:IUserWithID){
    this.userData={
    PersonalInfo:{
      ...user.PersonalInfo
    },
    block:user.block,
    CreatedAt:user.CreatedAt,
    partnerData:{
      gender:user.partnerData.gender
    },
    email:user.email,
    PlanData:user.PlanData,
    match:user.match,
    subscriber:user.subscriber,
    CurrentPlan:user.CurrentPlan
    }
   
    
  }

}
export class UserFetchData implements IUserFetchData { 
   withAge:IuserProfileReturnType  
  constructor(private user:IUserWithID){
    this.withAge={
    PersonalInfo:{
      ...user.PersonalInfo,
      age:getAge(user.PersonalInfo.dateOfBirth)
    },
    Email:user.email,
    subscriptionStatus:user.subscriber,
    currentPlan:user.CurrentPlan,
    PartnerData:user.PersonalInfo
    }
    }
}
