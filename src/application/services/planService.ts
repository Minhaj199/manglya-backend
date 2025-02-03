import { SubscriptionPlan } from "../../domain/entity/PlanEntity.js";
import { PurchasedPlan } from "../../Infrastructure/repositories/orderRepository.js";
import { PlanRepository } from "../../Infrastructure/repositories/planRepositories.js"; 
import { PlanServiceInterface } from "../../types/serviceLayerInterfaces.js";
import { SubscriptionPlanDocument } from "../../types/TypesAndInterfaces.js";


export class PlanService implements PlanServiceInterface{
    private planRepo:PlanRepository
    private purchaseRepo:PurchasedPlan
    constructor(planRepo:PlanRepository,purchaseRepo:PurchasedPlan){
        this.planRepo=planRepo
        this.purchaseRepo=purchaseRepo
    }
    async fetchAll(){
        try { 
            return this.planRepo.getAllPlans()
        } catch (error:any) {
            throw new Error(error)
        }
    }
    async createPlan(plan:SubscriptionPlan):Promise<SubscriptionPlanDocument|null>{
        try {
        
            const response= await this.planRepo.create(plan)
            return response
        } catch (error:any) {
            console.log(error)
            throw new Error(error)

        }
    }
    async editPlan(data: SubscriptionPlanDocument): Promise<boolean>{
        try {
            return await this.planRepo.editPlan(data)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async softDelete(id:string){
        try {
            if(typeof id!=='string'){
                throw new Error('erron on id getting')
            }
         return   await this.planRepo.softDlt(id)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async fetchHistory(id:string){
        try {
             const response=await this.purchaseRepo.fetchHistory(id)
             return response
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    
}