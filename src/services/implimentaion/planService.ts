import { ISubscriptionPlan } from "../../types/TypesAndInterfaces";
import { IPlanService } from "../interfaces/IPlanService";
import { SubscriptionPlanDocument } from "../../types/TypesAndInterfaces";
import { IPlanRepository } from "../../repository/interface/IPlanRepository";
import { IPurchasedPlan } from "../../repository/interface/IOtherRepositories";
import { PlanDTO } from "../../dtos/planRelatedDTO";
import { AppError } from "../../types/customErrorClass";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class PlanService implements IPlanService {
  private planRepo: IPlanRepository;
  private purchaseRepo: IPurchasedPlan;
  constructor(planRepo: IPlanRepository, purchaseRepo: IPurchasedPlan) {
    this.planRepo = planRepo;
    this.purchaseRepo = purchaseRepo;
  }
  async fetchAll() {
    try {
      const planData = await this.planRepo.fetchAllPlans();
      return new PlanDTO(planData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async createPlan(
    plan: ISubscriptionPlan
  ): Promise<{ created: boolean } | null> {
    try {
      const response = await this.planRepo.create(plan);
      if (response) {
        return { created: true };
      } else {
        throw new AppError("error on plan creation");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async editPlan(data: SubscriptionPlanDocument): Promise<boolean> {
    try {
      return await this.planRepo.editPlan(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async softDelete(id: string) {
    try {
      if (typeof id !== "string") {
        throw new Error("erron on id getting");
      }
      return await this.planRepo.softDlt(id);
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
      const response = await this.purchaseRepo.fetchHistory(id);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
