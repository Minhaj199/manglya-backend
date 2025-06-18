import { User, UserLinsting } from "../../types/UserRelatedTypes"
import {
  CurrentPlanReturnType,
  IAdminPlanType,
  IFindCurrentPlanAndRequests,
  IMatchedProfileType,
  IPlanOrder,
  IProfileTypeFetch,
  IRequestInterface,
  ISuggestion,
  IUserCurrentPlan,
} from "../../types/TypesAndInterfaces";
import {
  ILandingShowUesrsInterface,
  IUserWithID,
  UpdatedData,
} from "../../types/UserRelatedTypes";
import { Types } from "mongoose";

export interface ISuggestionRepository {
  fetchSuggetions(
    id: string,
    gender: string,
    partnerPreference: string
  ): Promise<
    {
      profile: ISuggestion[];
      request: IProfileTypeFetch;
      userProfile: IUserWithID[];
    }[]
  >;
}

export interface IUserProfileRepository {
  update(user: UpdatedData, id: string): Promise<IUserWithID>;
  updatePhoto(photo: string, email: string): Promise<boolean>;
  updateInterest(interest: string[], email: string): Promise<boolean>;
  fetchUserProfile(id: string): Promise<IUserWithID>;
  fetchName(id: string): Promise<string>;
  fetchPartnerProfils(
    userId: string,
    userGender: string,
    partnerGender: string
  ): Promise<{ profile: IProfileTypeFetch; request: IProfileTypeFetch }[]>;
}
export interface IMatchRepository {
  addMatch(
    userId: string,
    matchedId: string,
    user: IUserWithID
  ): Promise<boolean>;
  manageReqRes(
    requesterId: string,
    userId: string,
    action: string
  ): Promise<boolean>;
  fetchMatchedRequest(id: string): Promise<IMatchedProfileType[]>;
  deleteMatched(id: string, matched: string): Promise<boolean>;
  createRequest(id: string): Promise<IRequestInterface[]>;
  fetchPartnerIds(id: string): Promise<{ match: { _id: Types.ObjectId } }[]>;
}

export interface IUserRepository {
  create(user: User): Promise<IUserWithID>;
  fetchByEmail(email: string): Promise<IUserWithID | null>;
  fetchUsers(): Promise<ILandingShowUesrsInterface[] | []>;
  fetchEmailByID(id: unknown): Promise<{ email: string }>;
  fetchDashCount(): Promise<{
    subscriberGroups: { _id: string; count: number }[];
    totalCount: number;
  }>;
  fetchSubcriberCount(): Promise<{ _id: string; count: number }[]>;
  fetchRevenue(): Promise<{ _id: string; total: number }[]>;
  updatePassword(email: string, hashedPassword: string): Promise<boolean>;
  fetchCurrentPlan(
    userId: string
  ): Promise<{ CurrentPlan: IUserCurrentPlan }[] | []>;
  updatePurchaseData(
    userId: string,
    id: string,
    data: IPlanOrder
  ): Promise<boolean>;
  fetchEmail(email: string): Promise<IUserWithID | null>;
  expireUserPlans(currentDate: Date): Promise<void>;
  fetchUserDataForAdmin(): Promise<UserLinsting>;
  fetchSubscriber(): Promise<IAdminPlanType[] | []>;
  blockAndUnblockUser(id: string, action: boolean): Promise<boolean>;
  fetchCurrentPlanAndRequests(id: string): Promise<{
    request: IFindCurrentPlanAndRequests[];
    plan: CurrentPlanReturnType;
  }>;
}
