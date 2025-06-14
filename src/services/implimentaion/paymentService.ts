import { payment } from "../../utils/paymentAdapater.ts"; 
import { Token } from '@stripe/stripe-js';
import {  IPlanOrder, IUserCurrentPlan, PlanOrderMongo} from "../../types/TypesAndInterfaces.ts";

import { Types } from "mongoose";
import { GetExpiryPlan } from "../../utils/getExpiryDateOfPlan.ts";
import { IPaymentSerivice } from "../interfaces/IPaymentService.ts"; 
import { IUserRepository } from "../../repository/interface/IUserRepository.ts";

import { IPurchasedPlan } from "../../repository/interface/IOtherRepositories.ts";



export class PaymentSerivice implements IPaymentSerivice {
  private orderRepo:IPurchasedPlan
  private userRepo:IUserRepository
  constructor(orderRepo:IPurchasedPlan,userRepo:IUserRepository){
    this.orderRepo=orderRepo
    this.userRepo=userRepo
  }

  async purchase(plan:IUserCurrentPlan,token:Token,email:string,userId:string):Promise<boolean> {
    try {
    const userPlan=await this.userRepo.getCurrentPlan(userId)
    
     if(userPlan.length>0&&userPlan[0]?.CurrentPlan&&userPlan[0]){

       if(Number(userPlan[0]?.CurrentPlan.avialbleConnect)>0&&userPlan[0].CurrentPlan.name===plan.name){
         throw new Error('already have same plan and sufficiet connect.chouse different plan if you want')
       }
       
      }
      const result=await payment(plan,token,email)
     if(result==='succeeded'){
      const data: IPlanOrder = {
        userID: new Types.ObjectId(userId),
        amount: plan.amount,
        connect: Number(plan.connect),
        avialbleConnect: Number(plan.connect),
        duration: plan.duration,
        features: plan.features,
        name: plan.name,
        Expiry: GetExpiryPlan(plan.duration),
      };
      const response:PlanOrderMongo=await  this.orderRepo.create(data)
      
      const id=String(response?._id)
     
      if(typeof id==='string'){
        
        const response2 = await this.userRepo.addPurchaseData( id,userId,data)
        if(response2){
          return response2
        }else{
          throw new Error('internal server error on order creation 2')
        }
      }else{
         
        throw new Error('internal server error on order creation')
      }
    
    }else{
      return false
    }
    
    } catch (error) {
      if(error instanceof Error){
        if ('code' in error&&error.code === 11000) {
          throw new Error("Name already exist");
        } else {
          throw new Error(error.message||'undexpted error');
        }
      }else{
        throw new Error('unexpted error')
      }
    }
    
  }
}