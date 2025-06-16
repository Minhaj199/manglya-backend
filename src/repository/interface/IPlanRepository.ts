import { ISubscriptionPlan, SubscriptionPlanDocument } from "../../types/TypesAndInterfaces.ts";

export interface IPlanRepository{
    create(plan:ISubscriptionPlan):Promise<SubscriptionPlanDocument>
    getAllPlans():Promise<SubscriptionPlanDocument[]|[]>
        editPlan(data:SubscriptionPlanDocument):Promise<boolean>
    softDlt(id:string):Promise<boolean>
    fetchPlanAdmin():Promise<{name:string}[]|[]>
    
}