import {
  ISubscriptionPlan,
  SubscriptionPlanDocument,
} from "../../types/TypesAndInterfaces";

export interface IPlanRepository {
  create(plan: ISubscriptionPlan): Promise<SubscriptionPlanDocument>;
  fetchAllPlans(): Promise<SubscriptionPlanDocument[] | []>;
  editPlan(data: SubscriptionPlanDocument): Promise<boolean>;
  softDlt(id: string): Promise<boolean>;
  fetchPlanAdmin(): Promise<{ name: string }[] | []>;
}
