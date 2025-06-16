import { Token } from "@stripe/stripe-js";
import { IUserCurrentPlan } from "../../types/TypesAndInterfaces";

export interface IPaymentSerivice {
  purchase(
    plan: IUserCurrentPlan,
    token: Token,
    email: string,
    userId: string
  ): Promise<boolean>;
}