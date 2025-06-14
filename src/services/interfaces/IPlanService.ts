import { IPlanOrder, ISubscriptionPlan, SubscriptionPlanDocument } from "../../types/TypesAndInterfaces";

export interface IPlanService {
  fetchAll(): Promise<SubscriptionPlanDocument[] | []>;
  createPlan(plan: ISubscriptionPlan): Promise<SubscriptionPlanDocument | null>;
  editPlan(data: SubscriptionPlanDocument): Promise<boolean>;
  fetchHistory(id: string): Promise<IPlanOrder[]>;
  softDelete(id: string): Promise<boolean>
}