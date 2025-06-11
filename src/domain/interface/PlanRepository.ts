import { SubscriptionPlan } from "../entity/PlanEntity.ts";
import { SubscriptionPlanDocument } from "../../types/TypesAndInterfaces.ts";

export interface SubscriptionPlanRepo{
    create(plan:SubscriptionPlan):Promise<SubscriptionPlanDocument>
    getAllPlans():Promise<SubscriptionPlanDocument[]|[]>
    editPlan(data:SubscriptionPlanDocument):Promise<boolean>
    softDlt(id:string):Promise<boolean>
    fetchPlanAdmin():Promise<{name:string}[]|[]>
    
}