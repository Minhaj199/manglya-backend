import { Types } from "mongoose";
import { IPurchasedPlan } from "../interface/IOtherRepositories";
import { IPlanOrder, PlanOrderMongo } from "../../types/TypesAndInterfaces";
import { planOrderModel } from "../../models/planOrderModel";
import BaseRepository from "./baseRepository";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class PurchasedPlanRepository
  extends BaseRepository<PlanOrderMongo>
  implements IPurchasedPlan
{
  constructor() {
    super(planOrderModel);
  }
  async fetchRevenue(): Promise<number> {
    try {
      const revenue: { totalAmount: number }[] | [] =
        await planOrderModel.aggregate([
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]);
      if (revenue[0]?.totalAmount) {
        return revenue[0]?.totalAmount;
      } else {
        return 0;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchHistory(id: string) {
    try {
      const data: IPlanOrder[] = await this.model.aggregate([
        { $match: { userID: new Types.ObjectId(id) } },
        { $sort: { _id: -1 } },
        { $skip: 1 },
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
}
