import { Types } from "mongoose";
import { UserModel } from "../../models/userModel";
import { IProfileTypeFetch, ISuggestion } from "../../types/TypesAndInterfaces";
import { IUserWithID } from "../../types/UserRelatedTypes";
import { ISuggestionRepository } from "../interface/IUserRepository";
import BaseRepository from "./baseRepository";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class SuggestionRepository extends BaseRepository<IUserWithID> implements  ISuggestionRepository{
    constructor(){
      super(UserModel)
    }

   async fetchSuggetions(
    id: string,
    gender: string,
    partnerPreference: string
  ): Promise<
    {
      profile: ISuggestion[] | [];
      request: IProfileTypeFetch | [];
      userProfile: IUserWithID[] | [];
    }[]
  > {
    try {
      const datas: {
        profile: ISuggestion[] | [];
        request: IProfileTypeFetch | [];
        userProfile: IUserWithID[] | [];
      }[] = await UserModel.aggregate([
        {
          $facet: {
            profile: [
              {
                $match: {
                  $and: [
                    { "PersonalInfo.gender": partnerPreference },
                    { "partnerData.gender": gender },
                    { _id: { $ne: new Types.ObjectId(id) } },
                    {
                      match: {
                        $not: { $elemMatch: { _id: new Types.ObjectId(id) } },
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  name: "$PersonalInfo.firstName",
                  lookingFor: "$partnerData.gender",
                  secondName: "$PersonalInfo.secondName",
                  state: "$PersonalInfo.state",
                  gender: "$PersonalInfo.gender",
                  dateOfBirth: "$PersonalInfo.dateOfBirth",
                  interest: "$PersonalInfo.interest",
                  photo: "$PersonalInfo.image",
                  match: "$match",
                  subscriber: "$subscriber",
                  planFeatures: "$CurrentPlan.features",
                },
              },
              { $sort: { _id: -1 } },
            ],
            request: [
              { $match: { _id: new Types.ObjectId(id) } },
              { $unwind: "$match" },
              {
                $match: {
                  "match.status": "pending",
                  "match.typeOfRequest": "recieved",
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "match._id",
                  foreignField: "_id",
                  as: "matchedUser",
                },
              },
              { $unwind: "$matchedUser" },
              { $project: { _id: 0, matchedUser: 1 } },
              {
                $project: {
                  _id: "$matchedUser._id",
                  name: "$matchedUser.PersonalInfo.firstName",
                  lookingFor: "$matchedUser.partnerData.gender",
                  secondName: "$matchedUser.PersonalInfo.secondName",
                  state: "$matchedUser.PersonalInfo.state",
                  gender: "$matchedUser.PersonalInfo.gender",
                  dateOfBirth: "$matchedUser.PersonalInfo.dateOfBirth",
                  interest: "$matchedUser.PersonalInfo.interest",
                  photo: "$matchedUser.PersonalInfo.image",
                },
              },
              { $sort: { _id: -1 } },
            ],
            userProfile: [{ $match: { _id: new Types.ObjectId(id) } }],
          },
        },
      ]);

      return datas;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
   async fetchPartnerProfils(
    userId: string,
    userGender: string,
    partnerGender: string
  ): Promise<{ profile: IProfileTypeFetch; request: IProfileTypeFetch }[]> {
    try {
      return this.model.aggregate([
        {
          $facet: {
            profile: [
              {
                $match: {
                  $and: [
                    { "PersonalInfo.gender": partnerGender },
                    { "partnerData.gender": userGender },
                    {
                      match: {
                        $not: {
                          $elemMatch: { _id: new Types.ObjectId(userId) },
                        },
                      },
                    },
                    { _id: { $ne: new Types.ObjectId(userId) } },
                  ],
                },
              },
              {
                $project: {
                  name: "$PersonalInfo.firstName",
                  lookingFor: "$partnerData.gender",
                  secondName: "$PersonalInfo.secondName",
                  state: "$PersonalInfo.state",
                  gender: "$PersonalInfo.gender",
                  dateOfBirth: "$PersonalInfo.dateOfBirth",
                  interest: "$PersonalInfo.interest",
                  photo: "$PersonalInfo.image",
                  match: "$match",
                },
              },
              { $sort: { _id: -1 } },
              {$limit:3}
            ],
            request: [
              { $match: { _id: new Types.ObjectId(userId) } },
              { $unwind: "$match" },
              {
                $match: {
                  "match.status": "pending",
                  "match.typeOfRequest": "recieved",
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "match._id",
                  foreignField: "_id",
                  as: "matchedUser",
                },
              },
              { $unwind: "$matchedUser" },
              { $project: { _id: 0, matchedUser: 1 } },
              {
                $project: {
                  _id: "$matchedUser._id",
                  name: "$matchedUser.PersonalInfo.firstName",
                  lookingFor: "$matchedUser.partnerData.gender",
                  secondName: "$matchedUser.PersonalInfo.secondName",
                  state: "$matchedUser.PersonalInfo.state",
                  gender: "$matchedUser.PersonalInfo.gender",
                  dateOfBirth: "$matchedUser.PersonalInfo.dateOfBirth",
                  interest: "$matchedUser.PersonalInfo.interest",
                  photo: "$matchedUser.PersonalInfo.image",
                },
              },
              { $sort: { _id: -1 } },
            ],
          },
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

}