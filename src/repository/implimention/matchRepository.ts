import { Types, UpdateWriteOpResult } from "mongoose";
import { UserModel } from "../../models/userModel";
import { IUserWithID } from "../../types/UserRelatedTypes";
import { IMatchRepository } from "../interface/IUserRepository";
import BaseRepository from "./baseRepository";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";
import {
  IMatchedProfileType,
  IRequestInterface,
} from "../../types/TypesAndInterfaces";

export class MatchRepository
  extends BaseRepository<IUserWithID>
  implements IMatchRepository
{
  constructor() {
    super(UserModel);
  }
  async addMatch(
    userId: unknown,
    matchedId: string,
    user: IUserWithID
  ): Promise<boolean> {
    if (typeof userId === "string") {
      if (userId && matchedId) {
        const userMatchId = new Types.ObjectId(matchedId);
        const userID = new Types.ObjectId(userId);
        try {
          if (user?.CurrentPlan && user.CurrentPlan.avialbleConnect === 1) {
            const result = await UserModel.bulkWrite([
              {
                updateOne: {
                  filter: {
                    _id: userId,
                    match: { $not: { $elemMatch: { _id: userMatchId } } },
                  },
                  update: {
                    $addToSet: {
                      match: { _id: userMatchId, typeOfRequest: "send" },
                    },
                  },
                },
              },
              {
                updateOne: {
                  filter: {
                    _id: userId,
                    match: { $not: { $elemMatch: { _id: userMatchId } } },
                  },
                  update: { $set: { subscriber: "connection finished" } },
                },
              },
              {
                updateOne: {
                  filter: { _id: userId },
                  update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                },
              },
              {
                updateOne: {
                  filter: {
                    _id: matchedId,
                    match: { $not: { $elemMatch: { _id: userMatchId } } },
                  },
                  update: {
                    $addToSet: {
                      match: { _id: userID, typeOfRequest: "recieved" },
                    },
                  },
                },
              },
            ]);
            if (result) {
              return true;
            }
          } else if (
            user?.CurrentPlan &&
            user.CurrentPlan.avialbleConnect > 1
          ) {
            const result = await UserModel.bulkWrite([
              {
                updateOne: {
                  filter: {
                    _id: userId,
                    match: { $not: { $elemMatch: { _id: userMatchId } } },
                  },
                  update: {
                    $addToSet: {
                      match: { _id: userMatchId, typeOfRequest: "send" },
                    },
                  },
                },
              },
              {
                updateOne: {
                  filter: { _id: userId },
                  update: { $inc: { "CurrentPlan.avialbleConnect": -1 } },
                },
              },
              {
                updateOne: {
                  filter: {
                    _id: matchedId,
                    match: { $not: { $elemMatch: { _id: userId } } },
                  },
                  update: {
                    $addToSet: {
                      match: { _id: userID, typeOfRequest: "recieved" },
                    },
                  },
                },
              },
            ]);
            if (result) {
              return true;
            } else {
              throw new Error("Error on Request sending");
            }
          } else {
            throw new Error("Connection count over");
          }
        } catch {
          return false;
        }
      }
    } else {
      return false;
    }
    return false;
  }
  async manageReqRes(
    requesterId: string,
    userId: unknown,
    action: string
  ): Promise<boolean> {
    try {
      if (action === "accept" && typeof userId === "string") {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);

          const response = await UserModel.bulkWrite([
            {
              updateOne: {
                filter: { _id: convertedUserID, "match._id": convertedReqID },
                update: { $set: { "match.$.status": "accepted" } },
              },
            },
            {
              updateOne: {
                filter: { _id: convertedReqID, "match._id": convertedUserID },
                update: { $set: { "match.$.status": "accepted" } },
              },
            },
          ]);
          if (response) {
            return true;
          } else {
            return true;
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error(ResponseMessage.SERVER_ERROR);
          }
        }
      } else if (action === "reject" && typeof userId === "string") {
        try {
          const convertedReqID = new Types.ObjectId(requesterId);
          const convertedUserID = new Types.ObjectId(userId);

          const response = await UserModel.bulkWrite([
            {
              updateOne: {
                filter: {
                  _id: convertedUserID,
                  "match._id": convertedReqID,
                  "match.status": "pending",
                },
                update: { $set: { "match.$.status": "rejected" } },
              },
            },
            {
              updateOne: {
                filter: {
                  _id: convertedReqID,
                  "match._id": convertedUserID,
                  "match.status": "pending",
                },
                update: { $set: { "match.$.status": "rejected" } },
              },
            },
          ]);
          if (response) {
            return true;
          } else {
            return false;
          }
        } catch {
          throw new Error("error on manage Request");
        }
      } else {
        throw new Error("error on manage request");
      }
    } catch {
      throw new Error("error on manage request");
    }
  }
  async fetchMatchedRequest(id: string): Promise<IMatchedProfileType[] | []> {
    try {
      const profiles = await UserModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        { $project: { match: 1, _id: 0 } },
        { $unwind: "$match" },
        {
          $lookup: {
            from: "users",
            localField: "match._id",
            foreignField: "_id",
            as: "datas",
          },
        },
        { $unwind: "$datas" },
        { $match: { "match.status": "accepted" } },
        {
          $project: {
            _id: "$datas._id",
            photo: "$datas.PersonalInfo.image",
            firstName: "$datas.PersonalInfo.firstName",
            secondName: "$datas.PersonalInfo.secondName",
            state: "$datas.PersonalInfo.state",
            dateOfBirth: "$datas.PersonalInfo.dateOfBirth",
          },
        },
      ]);
      return profiles;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async deleteMatched(id: string, matched: string): Promise<boolean> {
    try {
      const response: UpdateWriteOpResult = await UserModel.updateOne(
        { _id: new Types.ObjectId(id) },
        { $pull: { match: { _id: matched } } }
      );
      await UserModel.updateOne(
        { _id: new Types.ObjectId(matched) },
        { $pull: { match: { _id: id } } }
      );
      if (response && response.acknowledged && response.modifiedCount >= 1) {
        return true;
      } else {
        throw new Error("not deleted");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async createRequest(id: string): Promise<IRequestInterface[]> {
    try {
      const user = await UserModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $project: {
            _id: "$_id",
            photo: "$PersonalInfo.image",
            name: "$PersonalInfo.firstName",
          },
        },
      ]);
      if (user) {
        return { ...user[0] };
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
    }
  }
  async fetchPartnerIds(id: string) {
    try {
      const result: { match: { _id: Types.ObjectId } }[] =
        await this.model.aggregate([
          { $match: { _id: new Types.ObjectId(id) } },
          { $project: { _id: 0, match: 1 } },
          { $unwind: "$match" },
          { $match: { "match.status": "accepted" } },
          { $project: { "match._id": 1 } },
        ]);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
