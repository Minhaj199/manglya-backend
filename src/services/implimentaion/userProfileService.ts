import { IUserRepository } from "../../repository/interface/IUserRepository.ts";
import { IPlanRepository } from '../../repository/interface/IPlanRepository.ts'
import { getAge } from "../../utils/ageCalculator.ts";
import {  IAdminPlanType, ICloudinaryAdapter,
} from "../../types/TypesAndInterfaces.ts";
import { IUserProfileService } from "../interfaces/IUserProfileService.ts";
import { IAuthSevice } from "../interfaces/IAuthSerivce.ts";
import { DataToBeUpdatedType, IuserProfileReturnType, IUserWithID, signupSecondBatchResType } from "../../types/UserRelatedTypes.ts"; 
import { ResponseMessage } from "../../constrain/ResponseMessageContrain.ts";
import { IPlanService } from "../interfaces/IPlanService.ts";
import { AppError } from "../../types/customErrorClass.ts";
import {  UserFetchData, UserInfoDTO } from "../../dtos/userRelatedDTO.ts";
import { SubscriberPlanDTO } from "../../dtos/planRelatedDTO.ts";

export class UserProfileService implements IUserProfileService {
 
  constructor(
  private readonly planRepo: IPlanRepository,
  private readonly imageSevice: ICloudinaryAdapter,
  private readonly userRepository: IUserRepository,
  private readonly authService: IAuthSevice,
  private readonly planService: IPlanService,
  ) {

  }
  async uploadPhoto(path: string, email: string) {
    try {
      const url = await this.imageSevice.upload(path);
      if (url && typeof url === "string") {
        const urlInserted = await this.userRepository.addPhoto(url, email);
        if (urlInserted) {
          return url;
        } else {
          return false;
        }
      } else {
        throw new Error("error on image url getting");
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async uploadInterest(intersts: string[], email: string) {
    try {
      return this.userRepository.addInterest(intersts, email);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchUserProfile(id: unknown) {
    try {
      if (typeof id === "string") {
        const data: IUserWithID = await this.userRepository.getUserProfile(id);
        return new UserFetchData(data)  
      } else {
        throw new Error("id not found-");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async updateEditedData(
    data: DataToBeUpdatedType,
    id: unknown
  ): Promise<{ data: IuserProfileReturnType; token: string | boolean }> {
    if (typeof id !== "string") {
      throw new Error("id not found");
    }
    const updateData: Record<string, string | Date | string[]> = {
      
    };

    if (data.PersonalInfo.firstName !== "")
      updateData["PersonalInfo.firstName"] = data.PersonalInfo.firstName;
    if (data.PersonalInfo.secondName !== "")
      updateData["PersonalInfo.secondName"] = data.PersonalInfo.secondName;
    if (data.PersonalInfo.state !== "")
      updateData["PersonalInfo.state"] = data.PersonalInfo.state;
    if (data.PersonalInfo.gender !== "")
      updateData["PersonalInfo.gender"] = data.PersonalInfo.gender;
    if (data.PersonalInfo.dateOfBirth !== "")
      updateData["PersonalInfo.dateOfBirth"] = new Date(
        data.PersonalInfo.dateOfBirth
      );
    if (data.PersonalInfo.interest !== null)
      updateData["PersonalInfo.interest"] = data.PersonalInfo.interest;
    if (data.partnerData.gender !== "")
      updateData["partnerData.gender"] = data.partnerData.gender;
    if (data.email !== "") updateData["email"] = data.email;

    try {
      if (Object.keys(updateData).length) {
        const data: IUserWithID = await this.userRepository.update(
          updateData,
          id
        );

        const token: string = this.authService.regenerateToken(
          JSON.stringify(data._id),
          "user",
          data.partnerData?.gender,
          data.PersonalInfo?.gender
        );

        if (data._id) {
          const useFullData: IuserProfileReturnType = {
            PersonalInfo: {
              ...data.PersonalInfo,
              age: getAge(data.PersonalInfo.dateOfBirth),
            },
            PartnerData: data.partnerData,
            Email: data.email,
            subscriptionStatus: data.subscriber,
            currentPlan: data.CurrentPlan,
          };
          return { data: useFullData, token };
        }
        const {withAge}= await this.fetchUserProfile(id);
        const profile=withAge 
        return { data: profile, token };
      } else {
        const{withAge} = await this.fetchUserProfile(id);
        return { data: withAge, token: false };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchUserByID(id: unknown) {
    try {
      if (typeof id === "string") {
        const email = await this.userRepository.findEmailByID(id);
        if (email.email) {
          return email.email;
        } else {
          throw new Error("Internal server error,email not found");
        }
      } else {
        throw new Error("Internal server error");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchName(id: string) {
    try {
      if (!id) {
        throw new Error("id not found");
      }
      return this.userRepository.fetchName(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchUserDatasForAdmin() {
    try {
      const data = await this.userRepository.fetchUserDataForAdmin();
        return new UserInfoDTO(data)
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchSubscriberDetailforAdmin() {
    try {
      const planDataDraft = await this.planRepo.fetchPlanAdmin();
      const userDataDraft: IAdminPlanType[] | [] =await this.userRepository.fetchSubscriber();
        return new SubscriberPlanDTO(planDataDraft,userDataDraft)
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async blockAndBlock(userId: string, action: boolean): Promise<boolean> {
    try {
      return this.userRepository.blockAndUnblockUser(userId, action);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async findCurrentPlanAndRequests(userId: string) {
    try { 
      const data=await this.userRepository.findCurrentPlanAndRequests(userId); 
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async signupSecondBatch(file:{path:string}|undefined,body:{email:string,interest:string}){
       const obj:signupSecondBatchResType= { responseFromAddinInterest: false, url: false };
    try {
      
      if (file && file.path) {
        const image = file?.path || "";
        
        const response =
        (await this.uploadPhoto(image,body.email)) ||
        "";
        
        obj.url = response;
      }
      
      const interest: string[] = JSON.parse(body.interest);
      if (interest.length > 0) {
        const responseFromAddinInterest =
          await this.uploadInterest(
            interest,
            body.email
          );
        obj.responseFromAddinInterest = responseFromAddinInterest;
      }
      console.log(obj)
      return(obj);
    } catch (error: unknown) {
      if(error instanceof Error){
        throw new Error(error.message)
      }else{
        throw new Error(ResponseMessage.SERVER_ERROR);

      }
    }
  }
   async updateProfile(file:unknown,userID:unknown,data:string){
    try {
      if(!userID||typeof userID !=='string'){
        throw new Error(ResponseMessage.ID_NOT_FOUND)
      }
      if (file&& typeof file==='object'&&'path' in file&&typeof file.path==='string') {
        const email = await this.fetchUserByID(userID);
        await this.uploadPhoto(file.path, email);
        const updateDetail = await this.updateEditedData(
          JSON.parse(data),
          userID
        );
        console.log(updateDetail)
        return({ status: true, newData: updateDetail });
      } else {
        const updateDetail = await this.updateEditedData(
          JSON.parse(data),
          userID
        );
        console.log(updateDetail)
        if (typeof updateDetail === "string") {
          return({status: false,  newData: updateDetail });
        } else {
          return({status: false,  newData: updateDetail });
        }
      }
    } catch (error) {

      if(error instanceof Error){
        throw new Error(error.message)
      }else{
        throw new Error(ResponseMessage.SERVER_ERROR);

      }
    }
  }
  async planHistoryAndRequest(id:unknown){

    try {
      if (typeof id !== "string") {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
      const response = await this.findCurrentPlanAndRequests(
        id
      );
      const history = await this.planService.fetchHistory(id);
      return({ ...response, history });
    
    } catch  {
      throw new Error("error on validating token please login again");
    }
  };
  async  fetchDatasForAdmin(from:unknown,){
    try {
      if(from!=='user'&&from!=='subscriber'){
        throw new Error('information category not found')
      }
      if(from==='user'){
        const {processedData}= await this.fetchUserDatasForAdmin();
        return(processedData);
      }else{
        const getSubscriberData=await  this.fetchSubscriberDetailforAdmin()
        return(getSubscriberData)
      }
    } catch (error) {
      console.log(error)
      if(error instanceof Error)throw new AppError(error.message)
      else throw new Error(ResponseMessage.SERVER_ERROR)
    }
  }
}
