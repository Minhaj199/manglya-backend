import {  Types, UpdateWriteOpResult } from "mongoose";
import {  ISubscriptionPlanDocument,  } from "../../types/TypesAndInterfaces";
import { planModel } from "../../models/planModel";
import BaseRepository from "./baseRepository";
import { IPlanRepository } from "../interface/IPlanRepository";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";


export class PlanRepository
  extends BaseRepository<ISubscriptionPlanDocument>
  implements IPlanRepository
{
  constructor() {
    super(planModel);
  }

  async fetchAllPlans(): Promise<ISubscriptionPlanDocument[] | []> {
    try {
      const response: ISubscriptionPlanDocument[] | [] = await planModel.find({
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
  async editPlan(data: ISubscriptionPlanDocument): Promise<boolean> {
    try {
      if (typeof data._id === "string") {
        const response:UpdateWriteOpResult = await this.model.updateOne(
          { _id: data._id },
          { $set: data }
        );
        if (response.modifiedCount) {
          return true;
        }else{
          return false
        }
      }
      throw new Error("Error on id");
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === 11000) {
        throw new Error("Name already exist");
      }
      if (error instanceof Error && "message" in error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async softDlt(id: string): Promise<boolean> {
    try {
      const response: UpdateWriteOpResult = await planModel.updateOne(
        { _id: id },
        { $set: { delete: true } }
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
        throw new Error("unexptected error");
      }
    }
  }
  async fetchPlanAdmin() {
    try {
      return await this.model.find({}, { _id: 0, name: 1 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchPlan(id: Types.ObjectId): Promise<ISubscriptionPlanDocument|null> {
    try {
      const fetcheData:ISubscriptionPlanDocument=await this.model.findById(id)
      return fetcheData
    } catch (error) {
        if(error instanceof Error){
          throw new Error(error.message||ResponseMessage.SERVER_ERROR)
        }else{
          throw new Error(ResponseMessage.SERVER_ERROR)
        }
    }
  }
  
}
