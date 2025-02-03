import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { Token } from '@stripe/stripe-js';


import {  UserCurrentPlan } from '../../types/TypesAndInterfaces.js';

const publicshKey=process.env.STRIPE_PUBLISH_KEY||''
const stripe=new Stripe(publicshKey)

export async function doStripePayment(plan:UserCurrentPlan,token:Token,email:string){

    
    if(!email){
        throw new Error('email not found')
    }
    let changedEmail:string=email as string
    try {
        
         
         
               const  idempotencyKey=uuidv4()
        
        const result=await stripe.customers.create({
            email:changedEmail,
            source:token?.id
        })
        const result2=await stripe.charges.create({
            amount:parseInt(plan.amount)*100,
            currency:'INR',
            customer:result.id,
            description:plan.name
            
        },{idempotencyKey})
        
        return(result2.status)
    } catch (error:any) {
        console.log(error)
        throw new Error(error)
    }
}