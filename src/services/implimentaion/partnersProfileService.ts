import { getAge } from "../../utils/ageCalculator";
import { socketIdMap } from "../../server";
import { IParnterService } from "../interfaces/IPartnerService";
import {
  IExtentedMatchProfile,
  IMatchedProfileType,
  IProfileTypeFetch,
  ISuggestion,
} from "../../types/TypesAndInterfaces";
import { IMatchRepository, ISuggestionRepository, IUserProfileRepository, IUserRepository } from "../../repository/interface/IUserRepository";
import { IOtherRepositories } from "../../repository/interface/IOtherRepositories";
import {
  ILandingShowUesrsInterface,
  IUserWithID,
} from "../../types/UserRelatedTypes";
import { ParternDataChatList } from "../../dtos/chattingrRelatedDTO";
import { IParternDataChatListDTO } from "../../types/dtoTypesAndInterfaces";

export class PartnerProfileService implements IParnterService {

  constructor(
      private userRepository: IUserRepository,
  private interestRepo: IOtherRepositories,
  private userProfileRepo:IUserProfileRepository,
  private suggetionRepo:ISuggestionRepository,
  private matchRepo:IMatchRepository
  ) {
      }
  async addMatch(userId: unknown, matchedId: string): Promise<boolean> {
    try {
      if (typeof userId === "string") {
        const user: IUserWithID | null =
          await this.userProfileRepo.fetchUserProfile(userId);
        if (user) {
          if (user.subscriber === "subscribed") {
            if (user.CurrentPlan) {
              if (user.CurrentPlan.Expiry > new Date()) {
                return this.matchRepo.addMatch(userId, matchedId, user);
              } else {
                throw new Error("You plan is Expired");
              }
            } else {
              throw new Error("No active Plan");
            }
          } else if (user.subscriber === "connect over") {
            throw new Error("You connection count over!! please buy a plan");
          } else {
            throw new Error("You are not subscribed, please buy a plan");
          }
        } else {
          throw new Error("user not found");
        }
      } else {
        throw new Error("id not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async manageReqRes(requesterId: string, userId: unknown, action: string) {
    try {
      if (typeof userId === "string") {
        return this.matchRepo.manageReqRes(requesterId, userId, action);
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchProfileData(
    userId: string,
    userGender: string,
    partnerGender: string
  ) {
    try {
      const datas: {
        profile: IProfileTypeFetch;
        request: IProfileTypeFetch;
      }[] = await this.userProfileRepo.fetchPartnerProfils(
        userId,
        userGender,
        partnerGender
      );
      const currntPlan = await this.userRepository.fetchCurrentPlan(userId);
      const interest: unknown[] = await this.interestRepo.fetchInterest();

      let interestArray: { allInterests: string[] }[] = [];
      if (interest?.length) {
        interestArray = interest as { allInterests: string[] }[];
      }
      if (!interestArray[0].allInterests) {
        throw new Error("Error on interest fetching");
      }

      if (datas[0].profile) {
        datas[0].profile = datas[0].profile.map((el, index) => {
          return {
            ...el,
            no: index + 1,
            age: getAge(el.dateOfBirth),
          };
        });
      }

      return {
        datas,
        currntPlan: currntPlan[0]?.CurrentPlan,
        interest: interestArray[0].allInterests,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchUserForLandingShow() {
    try {
      const data: ILandingShowUesrsInterface[] | [] =
        await this.userRepository.fetchUsers();
      if (data.length > 0) {
        const response: { name: string; age: number; image: string }[] = [];
        data.forEach((el:ILandingShowUesrsInterface) => {
          response.push({
            name: `${el.name} ${el.secondName}`,
            age: getAge(el.age),
            image: el.image || "",
          });
        });
        return response;
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
  async matchedProfiles(id: unknown): Promise<IParternDataChatListDTO | []> {
    try {
      if (typeof id !== "string") {
        return [];
      }
      const changedResponse: IExtentedMatchProfile[] = [];
      const Place: string[] = [];
      const response: IMatchedProfileType[] | [] =
        await this.matchRepo.fetchMatchedRequest(id);
      if (response.length) {
        const online: string[] = [];

        if (socketIdMap.size >= 1) {
          for (const value of socketIdMap.keys()) {
            online.push(value);
          }
        }
        response?.forEach((element) => {
          changedResponse.push({
            ...element,
            age: getAge(element.dateOfBirth),
          });
          if (!Place.includes(element.state)) Place.push(element.state);
        });
        const { connectedParterns, Places, onlines } = new ParternDataChatList(
          changedResponse,
          Place,
          online
        );
        
        return {connectedParterns, Places, onlines };
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
  async deleteMatchedUser(userId: unknown, partnerId: string) {
    if (typeof userId !== "string" || !partnerId) {
      throw new Error("error on deleting user");
    }
    try {
      if (typeof userId === "string" && typeof partnerId === "string") {
        const response = await this.matchRepo.deleteMatched(
          userId,
          partnerId
        );
        return response;
      } else {
        throw new Error("error on ids");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchSuggestions(
    id: unknown,
    partnerPreference: string,
    gender: string
  ) {
    try {
      if (typeof id === "string") {
        let fetchedProfiles: {
          profile: ISuggestion[];
          request: IProfileTypeFetch;
        }[] = [];
        const datas: {
          profile: ISuggestion[];
          request: IProfileTypeFetch;
          userProfile: IUserWithID[];
        }[] = await this.suggetionRepo.fetchSuggetions(
          id,
          gender,
          partnerPreference
        );
        const currntPlan = await this.userRepository.fetchCurrentPlan(id);
        if (datas[0].profile) {
          datas[0].profile = datas[0].profile?.map((el, index) => {
            return {
              ...el,
              no: index + 1,
              age: getAge(el.dateOfBirth),
            };
          });
        }

        if (datas[0].profile && datas[0].userProfile) {
          const main: IUserWithID = datas[0].userProfile[0];

          if (!main.PersonalInfo?.interest?.length) {
            return { datas: [{ profile: [], request:  datas[0].request }] };
          }
          const FirstCat: {
            subscriber: ISuggestion[];
            connectionOver: ISuggestion[];
            prioriy: ISuggestion[];
          } = { subscriber: [], connectionOver: [], prioriy: [] };
          for (const user of datas[0].profile) {
            if (
              main.PersonalInfo?.interest.every((el) =>
                user?.interest.includes(el)
              )
            ) {
              if (
                user.subscriber === "subscribed" ||
                user.subscriber === "connection over"
              ) {
                if (user?.planFeatures?.includes("Priority")) {
                  FirstCat.prioriy.push({ ...user, matchStatics: "hr" });
                } else {
                  FirstCat.subscriber.push({ ...user, matchStatics: "rc" });
                }
              }
            } else {
              if (
                user.subscriber === "subscribed" ||
                user.subscriber === "connection over"
              ) {
                if (
                  user?.planFeatures &&
                  user?.planFeatures?.includes("Priority") &&
                  user.interest?.some((elem) =>
                    main.PersonalInfo.interest?.includes(elem)
                  )
                ) {
                  FirstCat.prioriy.push({ ...user, matchStatics: "phr" });
                } else if (
                  user?.interest &&
                  user?.interest.some((elem) =>
                    main.PersonalInfo?.interest?.includes(elem)
                  )
                ) {
                  FirstCat.prioriy.push({ ...user, matchStatics: "np" });
                }
              }
            }
          }
          const array: ISuggestion[] = [
            ...FirstCat.prioriy,
            ...FirstCat.subscriber,
            ...FirstCat.connectionOver,
          ];
          fetchedProfiles = [{ profile: array, request: datas[0].request }];
        }
        return {
          datas: fetchedProfiles,
          currntPlan: (currntPlan[0]?.CurrentPlan)?currntPlan[0]?.CurrentPlan:null,
        };
      } else {
        throw new Error("id not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async createRequeset(id: string) {
    if (!id) {
      throw new Error("internal server error ");
    }
    try {
      return await this.matchRepo.createRequest(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}


  