import { IPlanDTO } from "../../types/dtoTypesAndInterfaces";
import { IPlanOrder, ISubscriptionPlan, SubscriptionPlanDocument } from "../../types/TypesAndInterfaces";

export interface IPlanService {
  fetchAll(): Promise<IPlanDTO>;
  createPlan(plan: ISubscriptionPlan): Promise<{created:boolean} | null>;
  editPlan(data: SubscriptionPlanDocument): Promise<boolean>;
  fetchHistory(id: string): Promise<IPlanOrder[]>;
  softDelete(id: string): Promise<boolean>
}