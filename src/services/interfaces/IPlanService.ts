import { IPlanDTO, planDTODataType } from "../../types/dtoTypesAndInterfaces";
import { IPlanOrder, ISubscriptionPlan, ISubscriptionPlanDocument } from "../../types/TypesAndInterfaces";

export interface IPlanService {
  fetchAll(): Promise<IPlanDTO>;
  createPlan(plan: ISubscriptionPlan): Promise<{created:boolean} | null>;
  editPlan(data: ISubscriptionPlanDocument): Promise<{plans:boolean}|IPlanDTO>;
  fetchHistory(id: string): Promise<IPlanOrder[]>;
  softDelete(id: string): Promise<boolean>
}