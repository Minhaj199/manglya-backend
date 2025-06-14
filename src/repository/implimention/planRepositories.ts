
import { Document,  UpdateWriteOpResult } from "mongoose";
import { ISubscriptionPlan } from "../../types/TypesAndInterfaces.ts"; 
import { planModel } from "../../models/planModel.ts";
import BaseRepository from "./baseRepository.ts";
import { IPlanRepository } from "../interface/IPlanRepository.ts";

 interface SubscriptionPlanDocument extends ISubscriptionPlan,Document{
    delete:boolean
}
export class PlanRepository extends BaseRepository<SubscriptionPlanDocument> implements IPlanRepository  {
constructor(){
    super(planModel)
}

  async getAllPlans(): Promise<SubscriptionPlanDocument[] | []> {
    try {
      const response: SubscriptionPlanDocument[] | [] = await planModel.find({
        delete: false,
      });
     
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
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
    } catch (error) {
      if (error instanceof Error&& 'code' in error&&error.code === 11000) {
        throw new Error("Name already exist");
      } if(error instanceof Error&&'message' in error){
        throw new Error(error.message);

      } 
      else {
        throw new Error('unexptected error');
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
    }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchPlanAdmin(){
    try {
      return await this.model.find({},{_id:0,name:1})
    }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  
}