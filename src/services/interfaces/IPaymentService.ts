import { Token } from "@stripe/stripe-js";
import { UserCurrentPlan } from "../../types/TypesAndInterfaces";

export interface IPaymentSerivice {
  purchase(
    plan: UserCurrentPlan,
    token: Token,
    email: string,
    userId: string
  ): Promise<boolean>;
}