import { IUserRepository } from "../../repository/interface/IUserRepository.ts";
import { IPlanRepository } from '../../repository/interface/IPlanRepository.ts'
import { getAge } from "../../utils/ageCalculator.ts";
import {  IAdminPlanType, ICloudinaryAdapter,
} from "../../types/TypesAndInterfaces.ts";
import { IUserProfileService } from "../interfaces/IUserProfileService.ts";
import { IAuthSevice } from "../interfaces/IAuthSerivce.ts";
import { DataToBeUpdatedType, IuserProfileReturnType, IUserWithID, signupSecondBatchResType } from "../../types/UserRelatedTypes.ts"; 
import { ResponseMessage } from "../../contrain/ResponseMessageContrain.ts";

export class UserProfileService implements IUserProfileService {
  private imageSevice: ICloudinaryAdapter;
  private userRepository: IUserRepository;
  private authService: IAuthSevice;
  private planRepo: IPlanRepository;
  constructor(
    planRepo: IPlanRepository,
    imageService: ICloudinaryAdapter,
    userRepository: IUserRepository,
    authService: IAuthSevice
  ) {
    this.imageSevice = imageService;
    this.userRepository = userRepository;
    this.authService = authService;
    this.planRepo = planRepo;
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
        const useFullData = {
          PersonalInfo: {
            ...data.PersonalInfo,
            age: getAge(data.PersonalInfo.dateOfBirth),
          },
          PartnerData: data.partnerData,
          Email: data.email,
          subscriptionStatus: data.subscriber,
          currentPlan: data.CurrentPlan,
        };

        return useFullData;
      } else {
        throw new Error("id not found-61");
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

        const profile = await this.fetchUserProfile(id);
        return { data: profile, token };
      } else {
        const response = await this.fetchUserProfile(id);
        return { data: response, token: false };
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
      if (data.length) {
        const processedData = data.map((el, index) => ({
          ...el,
          expiry: el?.CreatedAt ? el.CreatedAt.toDateString() : el?.CreatedAt,

          no: index + 1,
        }));
        return processedData;
      } else {
        return [];
      }
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
      const planData: { name: string }[] = planDataDraft?.map((el) => {
        return { name: el.name };
      });
      const userDataDraft: IAdminPlanType[] | [] =
        await this.userRepository.fetchSubscriber();
      if (userDataDraft.length > 0) {
        const userData: IAdminPlanType[] = userDataDraft.map((el, index) => {
          return {
            no: index + 1,
            username: el.username,
            MatchCountRemaining: el.MatchCountRemaining,
            expiry: new Date(el.expiry).toDateString(),
            planAmount: el.planAmount,
            planName: el.planName,
          };
        });

        return { userData, planData };
      } else {
        return { userData: [], planData: planData };
      }
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
      return await this.userRepository.findCurrentPlanAndRequests(userId);  
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
      console.log('272')
      if (file && file.path) {
        const image = file?.path || "";
        
        const response =
        (await this.uploadPhoto(image,body.email)) ||
        "";
        
        obj.url = response;
      }
      console.log('282')
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
}
