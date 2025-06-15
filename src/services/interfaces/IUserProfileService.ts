import { CurrentPlanReturnType, IAdminPlanType, IFindCurrentPlanAndRequests, IPlanOrder, IUserMgtUserfetchUserDatasForAdmin } from "../../types/TypesAndInterfaces";
import { DataToBeUpdatedType, IuserProfileReturnType, signupSecondBatchResType,  } from "../../types/UserRelatedTypes";


export interface IUserProfileService {
  uploadPhoto(path: string, email: string): Promise<string | false>;
  uploadInterest(intersts: string[], email: string): Promise<boolean>;
  fetchUserProfile(id: unknown): Promise<IuserProfileReturnType>;
  updateEditedData(
    data: DataToBeUpdatedType,
    id: unknown
  ): Promise<{ data: IuserProfileReturnType; token: string | boolean }>;
  fetchUserByID(id: unknown): Promise<string>;
  fetchName(id: string): Promise<string>;
  fetchUserDatasForAdmin(): Promise<IUserMgtUserfetchUserDatasForAdmin[]>;
  fetchSubscriberDetailforAdmin(): Promise<{
    userData: IAdminPlanType[] | [];
    planData: { name: string }[];
  }>;
  blockAndBlock(userId: string, action: boolean): Promise<boolean>;
  findCurrentPlanAndRequests(id: string): Promise<{
    request: IFindCurrentPlanAndRequests[];
    plan: CurrentPlanReturnType;
}>
signupSecondBatch(file: {path: string}|undefined, body: {
    email: string;
    interest: string;
}): Promise<signupSecondBatchResType>
updateProfile(file: unknown, userID: unknown, data: string): Promise<{
    status: boolean;
    newData: {
        data: IuserProfileReturnType;
        token: string | boolean;
    };
}>
planHistoryAndRequest(id: unknown): Promise<{
    history: IPlanOrder[];
    request: IFindCurrentPlanAndRequests[];
    plan: CurrentPlanReturnType;
}>
fetchDatasForAdmin(from:unknown): Promise<{
    expiry: string | Date;
    no: number;
    username: string;
    email: string;
    match: {
        _id: string;
        status: string;
        typeOfRequest: string;
    }[];
    subscriber: string;
    CreatedAt: Date;
    block: boolean;
}[]|{
  
    userData: IAdminPlanType[];
    planData: {
        name: string;
    }[];

}>
}