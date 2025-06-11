import { Types } from "mongoose";
import { PurchasedPlanInterface } from "../../domain/interface/otherRepositories.ts";
import { PlanOrder, PlanOrderMongo } from "../../types/TypesAndInterfaces.ts";
import { planOrderModel } from "../db/planOrder.ts";
import BaseRepository from "./baseRepository.ts";

export class PurchasedPlan extends BaseRepository<PlanOrderMongo> implements PurchasedPlanInterface {
  constructor(){
    super(planOrderModel)
  }
  async fetchRevenue():Promise<number>{
    try {
      const revenue:{totalAmount:number}[]|[]=await planOrderModel.aggregate([
        {
          $group: {
            _id: null, 
            totalAmount: { $sum: "$amount" } 
          }
        }
      ])
      if(revenue[0]?.totalAmount){
        return revenue[0]?.totalAmount
      }else{
        return 0
      }

    } catch (error:any) {
      throw new Error(error.message)
    }
  }
  async fetchHistory(id:string){
    try {
      const data:PlanOrder[]=await this.model.aggregate([{$match:{userID:new Types.ObjectId(id)}},{$sort:{_id:-1}},{$skip:1}])
        return data
    } catch (error:any) {
      throw new Error(error.message)
    }
  }

}