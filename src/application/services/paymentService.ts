import { doStripePayment } from "../../interface/utility/stripe.ts"; 
import { Token } from '@stripe/stripe-js';
import { PlanOrder, PlanOrderMongo, PlanOrdersEntity, UserCurrentPlan } from "../../types/TypesAndInterfaces.ts";
import {UserRepsitories} from "../../infrastructure/repositories/userRepository.ts";
import { PurchasedPlan } from "../../infrastructure/repositories/orderRepository.ts";
import { Types } from "mongoose";
import { GetExpiryPlan } from "../../interface/utility/getExpiryDateOfPlan.ts";
import { PaymentSeriviceInterface } from "../../types/serviceLayerInterfaces.ts";


export class PaymentSerivice implements PaymentSeriviceInterface {
  private orderRepo:PurchasedPlan
  private userRepo:UserRepsitories
  constructor(orderRepo:PurchasedPlan,userRepo:UserRepsitories){
    this.orderRepo=orderRepo
    this.userRepo=userRepo
  }

  async purchase(plan:UserCurrentPlan,token:Token,email:string,userId:string):Promise<boolean> {
    try {
    const userPlan=await this.userRepo.getCurrentPlan(userId)
    
     if(userPlan.length>0&&userPlan[0]?.CurrentPlan){

       if(Number(userPlan[0]?.CurrentPlan.avialbleConnect)>0&&userPlan[0].CurrentPlan.name===plan.name){
         throw new Error('already have same plan and sufficiet connect.chouse different plan if you want')
       }
       
      }
      const result=await doStripePayment(plan,token,email)
     if(result==='succeeded'){
      const data: PlanOrder = {
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
    
    } catch (error:any) {
      if (error.code === 11000) {
                throw new Error("Name already exist");
              } else {
                throw new Error(error);
              }
    }
    
  }
}