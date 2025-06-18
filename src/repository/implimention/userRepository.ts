import { IUserRepository } from "../interface/IUserRepository";
import { Types, UpdateWriteOpResult } from "mongoose";
import { planOrderModel } from "../../models/planOrderModel";
import BaseRepository from "./baseRepository";
import { UserModel } from "../../models/userModel";
import {
  ILandingShowUesrsInterface,
  IUserWithID,
} from "../../types/UserRelatedTypes";
import {
  CurrentPlanReturnType,
  CurrentPlanType,
  IAdminPlanType,
  IFindCurrentPlanAndRequests,
  IPlanOrder,
  IUserCurrentPlan,
} from "../../types/TypesAndInterfaces";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class UserRepsitories
  extends BaseRepository<IUserWithID>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async fetchByEmail(email: string): Promise<IUserWithID | null> {
    try {
      const user = await this.model.findOne({ email, block: false }).lean();

      return user as IUserWithID | null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

  async fetchUsers(): Promise<ILandingShowUesrsInterface[] | []> {
    try {
      const data = (await UserModel.aggregate([
        {
          $facet: {
            boys: [
              { $match: { "PersonalInfo.image": { $exists: true } } },
              { $match: { "PersonalInfo.gender": "male" } },
              { $sort: { _id: -1 } },
              { $limit: 2 },
            ],
            girls: [
              { $match: { "PersonalInfo.image": { $exists: true } } },
              { $match: { "PersonalInfo.gender": "female" } },
              { $sort: { _id: -1 } },
              { $limit: 2 },
            ],
          },
        },
        { $project: { combined: { $concatArrays: ["$boys", "$girls"] } } },
        { $unwind: "$combined" },
        { $replaceRoot: { newRoot: "$combined" } },
        {
          $project: {
            _id: 0,
            name: "$PersonalInfo.firstName",
            secondName: "$PersonalInfo.secondName",
            place: "$PersonalInfo.state",
            age: "$PersonalInfo.dateOfBirth",
            image: "$PersonalInfo.image",
          },
        },
      ])) as { name: string; secondName: string; age: Date; image: string }[];
      if (data.length) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchEmailByID(id: unknown): Promise<{ email: string }> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
      const changedId = id as string;
      const email: { email: string } | null = await UserModel.findById(
        changedId,
        { _id: 0, email: 1 }
      );
      if (email?.email) {
        return email;
      }
      throw new Error("email not found");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

  async fetchRevenue(): Promise<{ _id: string; total: number }[]> {
    const result = await planOrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);

    return result;
  }
  async fetchSubcriberCount(): Promise<{ _id: string; count: number }[]> {
    try {
      const data: { _id: string; count: number }[] = await UserModel.aggregate([
        { $group: { _id: "$subscriber", count: { $sum: 1 } } },
      ]);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchDashCount(): Promise<{
    subscriberGroups: { _id: string; count: number }[];
    totalCount: number;
  }> {
    const data: {
      totalCount: { totalCount: number }[];
      subscriberGroups: { _id: string; count: number }[];
    }[] = await UserModel.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "totalCount" }],
          subscriberGroups: [
            {
              $group: {
                _id: "$subscriber",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    return {
      subscriberGroups: data[0].subscriberGroups,
      totalCount: data[0].totalCount[0].totalCount,
    };
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const response: UpdateWriteOpResult = await UserModel.updateOne(
        { email: email },
        { password: hashedPassword }
      );
      if (response.matchedCount && response.modifiedCount) {
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

  async fetchCurrentPlan(
    userId: string
  ): Promise<{ CurrentPlan: IUserCurrentPlan }[] | []> {
    try {
      const response: { CurrentPlan: IUserCurrentPlan }[] | [] =
        await this.model.aggregate([
          { $match: { _id: new Types.ObjectId(userId) } },
          { $project: { _id: 0, CurrentPlan: 1 } },
        ]);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchCurrentPlanAndRequests(id: string) {
    try {
      const response: CurrentPlanType[] = await this.model.aggregate([
        {
          $facet: {
            request: [
              { $match: { _id: new Types.ObjectId(id) } },
              { $project: { match: 1, _id: 0 } },
              { $unwind: "$match" },
              { $match: { "match.typeOfRequest": "send" } },
              { $replaceRoot: { newRoot: "$match" } },
              {
                $lookup: {
                  from: "users",
                  localField: "_id",
                  foreignField: "_id",
                  as: "info",
                },
              },
              {
                $project: {
                  status: "$status",
                  typeOfRequest: "$typeOfRequest",
                  name: { $arrayElemAt: ["$info.PersonalInfo.firstName", 0] },
                },
              },
            ],
            currertPlan: [
              { $match: { _id: new Types.ObjectId(id) } },
              { $project: { CurrentPlan: 1, _id: 0 } },
            ],
          },
        },
      ]);
      const data:{
          request: IFindCurrentPlanAndRequests[];
          plan: CurrentPlanReturnType;
        } = {request: response[0].request || [],plan: response[0]?.currertPlan[0].CurrentPlan
          ? response[0]?.currertPlan[0].CurrentPlan
          : [],
      };
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async updatePurchaseData(
    planId: string,
    id: string,
    data: IPlanOrder
  ): Promise<boolean> {
    try {
      const result: unknown = await this.model.updateOne(
        { _id: new Types.ObjectId(id) },
        {
          $push: { PlanData: planId },
          $set: { subscriber: "subscribed", CurrentPlan: data },
        }
      );

      if (result) {
        return true;
      } else {
        throw new Error("internal server error");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

  async fetchEmail(email: string): Promise<IUserWithID | null> {
    try {
      return await UserModel.findOne({ email: email });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

  async expireUserPlans(currentDate: Date) {
    try {
      await this.model.updateMany(
        {
          subscriber: "subscribed",
          "CurrentPlan.Expiry": { $lte: currentDate },
        },
        { $set: { subscriber: "expired", CurrentPlan: [] } }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }

  async fetchUserDataForAdmin() {
    try {
      return await this.model.aggregate([
        { $sort: { _id: -1 } },
        {
          $project: {
            username: "$PersonalInfo.firstName",
            email: 1,
            match: 1,
            subscriber: 1,
            CreatedAt: 1,
            block: 1,
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
  async fetchSubscriber(): Promise<IAdminPlanType[] | []> {
    try {
      const data: IAdminPlanType[] | [] = await this.model.aggregate([
        {
          $match: {
            $or: [
              { subscriber: "subscribed" },
              { subscriber: "connection finished" },
            ],
          },
        },
        { $match: { "CurrentPlan.name": { $exists: true } } },
        {
          $project: {
            _id: 0,
            username: "$PersonalInfo.firstName",
            planName: "$CurrentPlan.name",
            MatchCountRemaining: "$CurrentPlan.avialbleConnect",
            expiry: "$CurrentPlan.Expiry",
            planAmount: "$CurrentPlan.amount",
          },
        },
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async blockAndUnblockUser(id: string, action: boolean): Promise<boolean> {
    try {
      const response: UpdateWriteOpResult = await this.model.updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { block: action } }
      );
      if (response.acknowledged) {
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
}


