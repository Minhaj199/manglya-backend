import { ISubscriptionPlan } from "../../types/TypesAndInterfaces.ts"; 
import { IPlanService } from "../interfaces/IPlanService.ts"; 
import { SubscriptionPlanDocument } from "../../types/TypesAndInterfaces.ts";
import { IPlanRepository } from "../../repository/interface/IPlanRepository.ts";
import { IPurchasedPlan } from "../../repository/interface/IOtherRepositories.ts";


export class PlanService implements IPlanService{
    private planRepo:IPlanRepository
    private purchaseRepo:IPurchasedPlan
    constructor(planRepo:IPlanRepository,purchaseRepo:IPurchasedPlan){
        this.planRepo=planRepo
        this.purchaseRepo=purchaseRepo
    }
    async fetchAll(){
        try { 
            return this.planRepo.getAllPlans()
        }catch (error) {
      if(error instanceof Error){
        throw new Error(error.message);
      }else{
        throw new Error('unexptected error');
      }
    }
    }
    async createPlan(plan:ISubscriptionPlan):Promise<SubscriptionPlanDocument|null>{
        try {
        
            const response= await this.planRepo.create(plan)
            return response
        } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message);
      }else{
        throw new Error('unexptected error');
      }
    }
    }
    async editPlan(data: SubscriptionPlanDocument): Promise<boolean>{
        try {

            return await this.planRepo.editPlan(data)
        } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message);
      }else{
        throw new Error('unexptected error');
      }
    }
    }
    async softDelete(id:string){
        try {
            if(typeof id!=='string'){
                throw new Error('erron on id getting')
            }
         return   await this.planRepo.softDlt(id)
        } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message);
      }else{
        throw new Error('unexptected error');
      }
    }
    }
    async fetchHistory(id:string){
        try {
             const response=await this.purchaseRepo.fetchHistory(id)
             return response
        } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message);
      }else{
        throw new Error('unexptected error');
      }
    }
    }
    
}