import { IUserWithID, UpdatedData } from "../../types/UserRelatedTypes";
import { IUserProfileRepository } from "../interface/IUserRepository";
import BaseRepository from "./baseRepository";
import { UserModel } from "../../models/userModel";
import { Types } from "mongoose";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";
import { IProfileTypeFetch } from "../../types/TypesAndInterfaces";

export class UserProfileRepository
  extends BaseRepository<IUserWithID>
  implements IUserProfileRepository
{
  constructor() {
    super(UserModel);
  }
  async update(user: UpdatedData, id: string): Promise<IUserWithID> {
    try {
      const response: unknown = await UserModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: user },
        { new: true }
      );
      if (response) {
        return response as IUserWithID;
      } else {
        throw new Error("not updated");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async updatePhoto(photo: string, email: string): Promise<boolean> {
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.image": photo } }
      );

      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async updateInterest(interst: string[], email: string): Promise<boolean> {
    try {
      const result = await UserModel.updateOne(
        { email },
        { $set: { "PersonalInfo.interest": interst } }
      );
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchUserProfile(id: string): Promise<IUserWithID> {
    try {
      const user: unknown = await UserModel.findOne({ _id: id }).lean();
      if (user) {
        return user as IUserWithID;
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchName(id: string): Promise<string> {
    try {
      const name: { PersonalInfo: { firstName: string } } | null =
        await UserModel.findById(id, { _id: 0, "PersonalInfo.firstName": 1 });
      if (name?.PersonalInfo.firstName) {
        return name?.PersonalInfo.firstName;
      } else {
        return "name";
      }
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
                     { block: false },
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
