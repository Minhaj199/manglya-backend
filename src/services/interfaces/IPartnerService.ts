import { IParternDataChatListDTO } from "../../types/dtoTypesAndInterfaces";
import {
  IFetchProfileDataType,
  IProfileTypeFetch,
  IRequestInterface,
  ISubscriptionPlanModel,
  ISuggestion,
} from "../../types/TypesAndInterfaces";

export interface IParnterService {
  addMatch(userId: unknown, matchedId: string): Promise<boolean>;
  manageReqRes(
    requesterId: string,
    userId: unknown,
    action: string
  ): Promise<boolean>;
  fetchProfileData(
    userId: string,
    userGender: string,
    partnerGender: string
  ): Promise<IFetchProfileDataType>;
  fetchUserForLandingShow(): Promise<
    { name: string; age: number; image: string }[] | []
  >;
  matchedProfiles(id: unknown): Promise<IParternDataChatListDTO | []>;
  fetchSuggestions(
    id: unknown,
    partnerPreference: string,
    gender: string
  ): Promise<
    | {
        datas: {
          profile: never[];
        }[];
        currntPlan?: undefined;
      }
    | {
        datas: {
          profile: ISuggestion[];
          request: IProfileTypeFetch;
        }[];
        currntPlan: ISubscriptionPlanModel;
      }
  >;
  deleteMatchedUser(userId: unknown, partnerId: string): Promise<boolean>;
  createRequeset(id: string): Promise<IRequestInterface[]>;
}
