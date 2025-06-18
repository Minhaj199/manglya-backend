import { v4 as uuidv4 } from "uuid";

import { Token } from "@stripe/stripe-js";

import { IUserCurrentPlan } from "../types/TypesAndInterfaces";
import { stripe } from "../config/stripeConfig";



export async function payment(
  plan: IUserCurrentPlan,
  token: Token,
  email: string
) {
  if (!email) {
    throw new Error("email not found");
  }
  const changedEmail: string = email as string;
  try {
    const idempotencyKey = uuidv4();

    const result = await stripe.customers.create({
      email: changedEmail,
      source: token?.id,
    });
    const result2 = await stripe.charges.create(
      {
        amount: parseInt(plan.amount) * 100,
        currency: "INR",
        customer: result.id,
        description: plan.name,
      },
      { idempotencyKey }
    );

    return result2.status;
  } catch (error) {
    if(error instanceof Error){
        throw new Error(error.message);
    }
  }
}
