
import { Document, Types, UpdateWriteOpResult } from "mongoose";
import { SubscriptionPlan } from "../../domain/entity/PlanEntity.js";
import { SubscriptionPlanRepo } from "../../domain/interface/PlanRepo.js";
import { planModel } from "../db/planModel.js";
import BaseRepository from "./baseRepository.js";

 interface SubscriptionPlanDocument extends SubscriptionPlan,Document{
    delete:boolean
}
export class PlanRepository extends BaseRepository<SubscriptionPlanDocument> implements SubscriptionPlanRepo  {
constructor(){
    super(planModel)
}

  async getAllPlans(): Promise<SubscriptionPlanDocument[] | []> {
    try {
      const response: SubscriptionPlanDocument[] | [] = await planModel.find({
        delete: false,
      });
     
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async editPlan(data: SubscriptionPlanDocument): Promise<boolean> {
    try {
      if (typeof data._id === "string") {
        const response = await planModel.updateOne(
          { _id: data._id },
          { $set: data }
        );
        if (response) {
          return true
        }
      }
      throw new Error("Error on id");
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Name already exist");
      } else {
        throw new Error(error);
      }
    }
  }
  async softDlt(id: string): Promise<boolean> {
    try {
   
      const response:UpdateWriteOpResult = await planModel.updateOne(
        { _id: id },
        { $set: { delete: true } }
      );
      if (response.acknowledged) {
       
        return true;
      }else{
        return false
      }
    } catch (error: any) {
      throw new Error(error.message || "error on remove plan");
    }
  }
  async fetchPlanAdmin(){
    try {
      return await this.model.find({},{_id:0,name:1})
    } catch (error:any) {
      throw new Error(error.message)
    }
  }
  
}