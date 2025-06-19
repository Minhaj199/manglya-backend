import { Types } from "mongoose";
import {
  ISubscriptionPlan,
  ISubscriptionPlanDocument,
} from "../../types/TypesAndInterfaces";

export interface IPlanRepository {
  create(plan: ISubscriptionPlan): Promise<ISubscriptionPlanDocument>;
  fetchAllPlans(): Promise<ISubscriptionPlanDocument[] | []>;
  editPlan(data: ISubscriptionPlanDocument): Promise<boolean>;
  softDlt(id: string): Promise<boolean>;
  fetchPlanAdmin(): Promise<{ name: string }[] | []>;
  fetchPlan(id:Types.ObjectId):Promise<ISubscriptionPlanDocument|null>
}
